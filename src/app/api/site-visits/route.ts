import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// POST - Отметить дайв-сайт как посещенный
export async function POST(request: NextRequest) {
  try {
    // Создаем Supabase клиент с куками из запроса
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // В API роутах мы не можем устанавливать куки напрямую
            // Supabase будет обрабатывать это автоматически
          },
        },
      },
    );

    // Проверяем авторизацию
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'User must be authenticated to mark sites as visited',
        },
        { status: 401 },
      );
    }

    // Получаем данные из запроса
    const { site_id } = await request.json();

    if (!site_id) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          details: 'site_id is required',
        },
        { status: 400 },
      );
    }

    // Проверяем, что дайв-сайт существует
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('id')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        {
          error: 'Not Found',
          details: 'Dive site not found',
        },
        { status: 404 },
      );
    }

    // Проверяем, не отмечен ли уже сайт как посещенный
    const { data: existingVisit, error: checkError } = await supabase
      .from('site_visits')
      .select('id')
      .eq('user_id', user.id)
      .eq('site_id', site_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        {
          error: 'Database Error',
          details: checkError.message,
        },
        { status: 500 },
      );
    }

    if (existingVisit) {
      return NextResponse.json(
        {
          error: 'Conflict',
          details: 'Site already marked as visited',
        },
        { status: 409 },
      );
    }

    // Создаем запись о посещении
    const { data: visit, error: insertError } = await supabase
      .from('site_visits')
      .insert({
        user_id: user.id,
        site_id: site_id,
        visited_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          error: 'Database Error',
          details: insertError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: visit,
    });
  } catch (error) {
    console.error('Error marking site as visited:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// DELETE - Удалить отметку о посещении
export async function DELETE(request: NextRequest) {
  try {
    // Создаем Supabase клиент с куками из запроса
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // В API роутах мы не можем устанавливать куки напрямую
            // Supabase будет обрабатывать это автоматически
          },
        },
      },
    );

    // Проверяем авторизацию
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'User must be authenticated to remove visit marks',
        },
        { status: 401 },
      );
    }

    // Получаем site_id из query параметров
    const { searchParams } = new URL(request.url);
    const site_id = searchParams.get('site_id');

    if (!site_id) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          details: 'site_id parameter is required',
        },
        { status: 400 },
      );
    }

    // Удаляем запись о посещении
    const { data: deletedVisit, error: deleteError } = await supabase
      .from('site_visits')
      .delete()
      .eq('user_id', user.id)
      .eq('site_id', site_id)
      .select()
      .single();

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        return NextResponse.json(
          {
            error: 'Not Found',
            details: 'Visit record not found',
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          error: 'Database Error',
          details: deleteError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedVisit,
    });
  } catch (error) {
    console.error('Error removing visit mark:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// GET - Получить посещения пользователя
export async function GET(request: NextRequest) {
  try {
    // Создаем Supabase клиент с куками из запроса
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // В API роутах мы не можем устанавливать куки напрямую
            // Supabase будет обрабатывать это автоматически
          },
        },
      },
    );

    // Проверяем авторизацию
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'User must be authenticated to view visits',
        },
        { status: 401 },
      );
    }

    // Получаем посещения пользователя
    const { data: visits, error: visitsError } = await supabase
      .from('site_visits')
      .select(
        `
        id,
        site_id,
        visited_at,
        sites (
          id,
          name,
          latitude,
          longitude
        )
      `,
      )
      .eq('user_id', user.id)
      .order('visited_at', { ascending: false });

    if (visitsError) {
      return NextResponse.json(
        {
          error: 'Database Error',
          details: visitsError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: visits,
    });
  } catch (error) {
    console.error('Error fetching user visits:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
