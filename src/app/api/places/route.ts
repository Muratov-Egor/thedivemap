import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Константы
const LIMIT_SITES = 5;
const LIMIT_COUNTRIES = 3;
const LIMIT_REGIONS = 3;
const LIMIT_LOCATIONS = 3;

// Хелперы
const localize = (base: string, lang: 'ru' | 'en') => `${base}_${lang}`;

const ilikeBothLangs = (field: string, query: string) =>
  `${field}_ru.ilike.%${query}%,${field}_en.ilike.%${query}%`;

const localizeList = <T extends Record<string, unknown>>(list: T[], nameField: string): T[] => {
  return list.map((item) => ({
    ...item,
    name: item[nameField as keyof T],
  }));
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') === 'en' ? 'en' : 'ru';
  const q = searchParams.get('q')?.toLowerCase();

  // Проверяем, что параметр q обязателен
  if (!q) {
    return NextResponse.json({ error: 'Parameter "q" is required' }, { status: 400 });
  }

  const searchPattern = `%${q}%`;

  const nameField = localize('name', lang);
  const labelField = localize('label', lang);

  try {
    const [
      { data: sites, error: sitesError },
      { data: countriesRaw, error: countriesError },
      { data: regionsRaw, error: regionsError },
      { data: locationsRaw, error: locationsError },
    ] = await Promise.all([
      // 1. Dive sites
      supabase
        .from('sites')
        .select(
          `
          id,
          name,
          country:country_id(
            ${nameField},
            region:region_id(${nameField})
          ),
          site_type:site_type_id(${labelField}),
          site_locations(
            location:location_id(${nameField})
          )
        `,
        )
        .ilike('name', searchPattern)
        .limit(LIMIT_SITES),

      // 2. Countries (только те, где есть дайв-сайты)
      supabase
        .from('countries')
        .select('id, name_ru, name_en, iso_code, sites!inner(id)')
        .or(ilikeBothLangs('name', q))
        .limit(LIMIT_COUNTRIES * 10), // увеличиваем лимит для дедупликации

      // 3. Regions
      supabase
        .from('regions')
        .select('id, name_ru, name_en')
        .or(ilikeBothLangs('name', q))
        .limit(LIMIT_REGIONS),

      // 4. Locations
      supabase
        .from('locations')
        .select('id, name_ru, name_en, country_id, region_id')
        .or(ilikeBothLangs('name', q))
        .limit(LIMIT_LOCATIONS),
    ]);

    if (sitesError) throw sitesError;

    // Убираем дубликаты стран (из-за inner join с sites)
    const uniqueCountriesRaw = countriesRaw ? 
      Array.from(new Map(countriesRaw.map(country => [country.id, {
        id: country.id,
        name_ru: country.name_ru,
        name_en: country.name_en,
        iso_code: country.iso_code
      }])).values()).slice(0, LIMIT_COUNTRIES) : [];

    const countries = localizeList(uniqueCountriesRaw, nameField);
    const regions = localizeList(regionsRaw ?? [], nameField);
    const locations = (locationsRaw ?? []).map(
      (loc: {
        id: number;
        name_ru: string;
        name_en: string;
        country_id: number;
        region_id: number;
      }) => ({
        id: loc.id,
        name: nameField === 'name_en' ? loc.name_en : loc.name_ru || '',
        country_id: loc.country_id,
        region_id: loc.region_id,
      }),
    );

    return NextResponse.json({
      sites,
      countries,
      regions,
      locations,
      errors: {
        countries: countriesError?.message || null,
        regions: regionsError?.message || null,
        locations: locationsError?.message || null,
      },
    });
  } catch (err) {
    console.error('[Autocomplete Error]', {
      lang,
      query: q,
      error: err,
    });
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
