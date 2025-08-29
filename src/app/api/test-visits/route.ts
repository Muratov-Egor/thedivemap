import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Получаем текущего пользователя
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'User must be authenticated',
        },
        { status: 401 },
      );
    }

    // Получаем все посещения пользователя
    const { data: visits, error: visitsError } = await supabase
      .from('site_visits')
      .select(
        `
        id,
        site_id,
        visited_at,
        sites (
          id,
          name
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
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
      },
      visits: visits || [],
    });
  } catch (error) {
    console.error('Test visits error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
