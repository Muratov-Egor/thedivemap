import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Загружаем все типы фильтров параллельно
    const [siteTypesResult, difficultiesResult] = await Promise.all([
      supabase.from('site_types').select('id, label_ru, label_en').order('id'),
      supabase.from('difficulties').select('id, label_ru, label_en').order('id'),
    ]);

    if (siteTypesResult.error) {
      return NextResponse.json({ error: siteTypesResult.error.message }, { status: 500 });
    }

    if (difficultiesResult.error) {
      return NextResponse.json({ error: difficultiesResult.error.message }, { status: 500 });
    }

    // Возвращаем данные на всех языках
    const siteTypes = siteTypesResult.data.map((type) => ({
      id: type.id,
      labels: {
        ru: type.label_ru,
        en: type.label_en,
      },
    }));

    const difficulties = difficultiesResult.data.map((difficulty) => ({
      id: difficulty.id,
      labels: {
        ru: difficulty.label_ru,
        en: difficulty.label_en,
      },
    }));

    return NextResponse.json({
      site_types: siteTypes,
      difficulties: difficulties,
    });
  } catch (err) {
    console.error('Error fetching filters:', err);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
