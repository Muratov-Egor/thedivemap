import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'ru';

    // Загружаем все типы фильтров параллельно
    const [siteTypesResult, difficultiesResult] = await Promise.all([
      supabase
        .from('site_types')
        .select('id, label_ru, label_en')
        .order('id'),
      supabase
        .from('difficulties')
        .select('id, label_ru, label_en')
        .order('id'),
    ]);

    if (siteTypesResult.error) {
      return NextResponse.json({ error: siteTypesResult.error.message }, { status: 500 });
    }

    if (difficultiesResult.error) {
      return NextResponse.json({ error: difficultiesResult.error.message }, { status: 500 });
    }

    // Локализуем данные
    const localizedSiteTypes = siteTypesResult.data.map(type => ({
      id: type.id,
      label: lang === 'en' ? type.label_en : type.label_ru
    }));

    const localizedDifficulties = difficultiesResult.data.map(difficulty => ({
      id: difficulty.id,
      label: lang === 'en' ? difficulty.label_en : difficulty.label_ru
    }));

    return NextResponse.json({
      site_types: localizedSiteTypes,
      difficulties: localizedDifficulties,
    });
  } catch (err) {
    console.error('Error fetching filters:', err);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
