import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { DiveSiteDetails } from '@/lib/types/supabase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Валидация UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: 'Invalid site ID format' }, { status: 400 });
    }

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

    // Получаем основную информацию о дайв-сайте со всеми связанными данными
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select(
        `
        *,
        country:countries(
          *,
          region:regions(*)
        ),
        site_type:site_types(*),
        difficulty:difficulties(*),
        site_locations(
          location:locations(
            *,
            country:countries(*),
            region:regions(*)
          )
        ),
        images(*)
      `,
      )
      .eq('id', id)
      .single();

    if (siteError) {
      if (siteError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Dive site not found' }, { status: 404 });
      }
      return NextResponse.json({ error: siteError.message }, { status: 500 });
    }

    // Проверяем авторизацию пользователя
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userVisit = null;

    // Если пользователь авторизован, получаем информацию о его посещении
    if (user) {
      const { data: visit, error: visitError } = await supabase
        .from('site_visits')
        .select('id, visited_at')
        .eq('user_id', user.id)
        .eq('site_id', id)
        .single();

      // Игнорируем ошибку если запись не найдена (это нормально)
      if (!visitError && visit) {
        userVisit = visit;
      }
    }

    // Преобразуем данные в нужный формат
    const diveSiteDetails: DiveSiteDetails = {
      ...site,
      country: site.country,
      site_type: site.site_type,
      difficulty: site.difficulty,
      site_locations: site.site_locations || [],
      images: site.images || [],
      user_visit: userVisit, // Добавляем информацию о посещении пользователя
    };

    return NextResponse.json(diveSiteDetails);
  } catch (err) {
    console.error('Error fetching dive site details:', err);
    return NextResponse.json({ error: 'Failed to fetch dive site details' }, { status: 500 });
  }
}
