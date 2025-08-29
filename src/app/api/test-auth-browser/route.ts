import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

    // Получаем текущего пользователя
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Получаем все куки для отладки
    const allCookies = request.cookies.getAll();

    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
          }
        : null,
      userError: userError?.message,
      cookies: allCookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value.substring(0, 20) + '...', // Показываем только начало значения
      })),
      cookieCount: allCookies.length,
    });
  } catch (error) {
    console.error('Test auth browser error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
