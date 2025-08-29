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

    const results = {
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
          }
        : null,
      userError: userError?.message,
      tests: {} as Record<string, any>,
    };

    // Тест 1: Проверяем доступ к таблице site_visits без авторизации
    try {
      const { data: visits, error: visitsError } = await supabase
        .from('site_visits')
        .select('*')
        .limit(1);

      results.tests.site_visits_access = {
        success: !visitsError,
        error: visitsError?.message,
        data: visits,
        note: visitsError
          ? 'RLS likely enabled - access denied without auth'
          : 'RLS likely disabled - public access',
      };
    } catch (error) {
      results.tests.site_visits_access = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Тест 2: Проверяем доступ к таблице users без авторизации
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, name')
        .limit(1);

      results.tests.users_access = {
        success: !usersError,
        error: usersError?.message,
        data: users,
        note: usersError
          ? 'RLS likely enabled - access denied without auth'
          : 'RLS likely disabled - public access',
      };
    } catch (error) {
      results.tests.users_access = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Тест 3: Проверяем доступ к таблице sites (должен быть публичным)
    try {
      const { data: sites, error: sitesError } = await supabase
        .from('sites')
        .select('id, name')
        .limit(1);

      results.tests.sites_access = {
        success: !sitesError,
        error: sitesError?.message,
        data: sites,
        note: 'Sites should be publicly accessible',
      };
    } catch (error) {
      results.tests.sites_access = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Тест 4: Пытаемся создать запись в site_visits без авторизации
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('site_visits')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Тестовый UUID
          site_id: '00000000-0000-0000-0000-000000000000', // Тестовый UUID
          visited_at: new Date().toISOString(),
        })
        .select();

      results.tests.site_visits_insert_unauthorized = {
        success: !insertError,
        error: insertError?.message,
        data: insertData,
        note: insertError
          ? 'RLS likely enabled - insert denied without auth'
          : 'RLS likely disabled - insert allowed',
      };
    } catch (error) {
      results.tests.site_visits_insert_unauthorized = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Тест 5: Проверяем структуру таблицы site_visits
    try {
      const { data: structure, error: structureError } = await supabase
        .from('site_visits')
        .select('id, user_id, site_id, visited_at')
        .limit(0); // Не получаем данные, только проверяем структуру

      results.tests.site_visits_structure = {
        success: !structureError,
        error: structureError?.message,
        columns: structureError ? null : ['id', 'user_id', 'site_id', 'visited_at'],
        note: 'Checking if table structure is accessible',
      };
    } catch (error) {
      results.tests.site_visits_structure = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
