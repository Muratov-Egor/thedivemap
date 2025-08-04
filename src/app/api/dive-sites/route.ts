import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DiveSitesFilters } from '@/types/database';

// Функция валидации параметров фильтрации
function validateFilters(filters: DiveSitesFilters): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Валидация ID (UUID формат)
  if (
    filters.id &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(filters.id)
  ) {
    errors.push('Invalid site ID format');
  }

  // Валидация числовых ID параметров
  const idParams = [
    'country_id',
    'region_id',
    'location_id',
    'site_type_id',
    'difficulty_id',
  ] as const;
  for (const param of idParams) {
    const value = filters[param];
    if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0)) {
      errors.push(`Invalid ${param}: must be a positive number`);
    }
  }

  // Валидация числовых параметров "от и выше"
  const minParams = ['depth_min', 'visibility_min', 'rating_min'] as const;
  for (const param of minParams) {
    const value = filters[param];
    if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0)) {
      errors.push(`Invalid ${param}: must be a positive number`);
    }
  }

  // Валидация статуса
  if (filters.status && !['draft', 'published', 'rejected'].includes(filters.status)) {
    errors.push('Invalid status: must be draft, published, or rejected');
  }

  return { valid: errors.length === 0, errors };
}

// Функция построения SQL запроса с фильтрами
function buildFilteredQuery(filters: DiveSitesFilters) {
  // Начинаем с базового запроса
  let query = supabase.from('sites').select(`
      *,
      country:countries(*),
      site_type:site_types(*),
      difficulty:difficulties(*)
    `);

  // Применяем простые фильтры
  if (filters.id) {
    query = query.eq('id', filters.id);
  }

  if (filters.country_id) {
    query = query.eq('country_id', filters.country_id);
  }

  if (filters.site_type_id) {
    query = query.eq('site_type_id', filters.site_type_id);
  }

  if (filters.difficulty_id) {
    query = query.eq('difficulty_id', filters.difficulty_id);
  }

  if (filters.depth_min) {
    query = query.gte('depth_max', filters.depth_min);
  }

  if (filters.visibility_min) {
    query = query.gte('visibility', filters.visibility_min);
  }

  if (filters.rating_min) {
    query = query.gte('rating', filters.rating_min);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  return query;
}

// Функция для фильтрации по региону с дополнительными фильтрами
async function filterByRegion(regionId: number, additionalFilters: DiveSitesFilters) {
  const { data: countries, error: countriesError } = await supabase
    .from('countries')
    .select('id')
    .eq('region_id', regionId);

  if (countriesError) throw countriesError;

  const countryIds = countries.map((c) => c.id);

  let query = supabase
    .from('sites')
    .select(
      `
      *,
      country:countries(*),
      site_type:site_types(*),
      difficulty:difficulties(*)
    `,
    )
    .in('country_id', countryIds);

  // Применяем дополнительные фильтры
  if (additionalFilters.id) {
    query = query.eq('id', additionalFilters.id);
  }

  if (additionalFilters.site_type_id) {
    query = query.eq('site_type_id', additionalFilters.site_type_id);
  }

  if (additionalFilters.difficulty_id) {
    query = query.eq('difficulty_id', additionalFilters.difficulty_id);
  }

  if (additionalFilters.depth_min) {
    query = query.gte('depth_max', additionalFilters.depth_min);
  }

  if (additionalFilters.visibility_min) {
    query = query.gte('visibility', additionalFilters.visibility_min);
  }

  if (additionalFilters.rating_min) {
    query = query.gte('rating', additionalFilters.rating_min);
  }

  if (additionalFilters.status) {
    query = query.eq('status', additionalFilters.status);
  }

  return query;
}

// Функция для фильтрации по локации с дополнительными фильтрами
async function filterByLocation(locationId: number, additionalFilters: DiveSitesFilters) {
  const { data: siteLocations, error: siteLocationsError } = await supabase
    .from('site_locations')
    .select('site_id')
    .eq('location_id', locationId);

  if (siteLocationsError) throw siteLocationsError;

  const siteIds = siteLocations.map((sl) => sl.site_id);

  let query = supabase
    .from('sites')
    .select(
      `
      *,
      country:countries(*),
      site_type:site_types(*),
      difficulty:difficulties(*)
    `,
    )
    .in('id', siteIds);

  // Применяем дополнительные фильтры
  if (additionalFilters.id) {
    query = query.eq('id', additionalFilters.id);
  }

  if (additionalFilters.country_id) {
    query = query.eq('country_id', additionalFilters.country_id);
  }

  if (additionalFilters.site_type_id) {
    query = query.eq('site_type_id', additionalFilters.site_type_id);
  }

  if (additionalFilters.difficulty_id) {
    query = query.eq('difficulty_id', additionalFilters.difficulty_id);
  }

  if (additionalFilters.depth_min) {
    query = query.gte('depth_max', additionalFilters.depth_min);
  }

  if (additionalFilters.visibility_min) {
    query = query.gte('visibility', additionalFilters.visibility_min);
  }

  if (additionalFilters.rating_min) {
    query = query.gte('rating', additionalFilters.rating_min);
  }

  if (additionalFilters.status) {
    query = query.eq('status', additionalFilters.status);
  }

  return query;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Извлекаем параметры фильтрации с улучшенной обработкой
    const filters: DiveSitesFilters = {};
    const validationErrors: string[] = [];

    // Обработка ID (строка)
    if (searchParams.has('id')) {
      const idValue = searchParams.get('id');
      if (idValue !== null && idValue !== '') {
        filters.id = idValue;
      }
    }

    // Обработка числовых параметров
    const numericParams = [
      'country_id',
      'region_id',
      'location_id',
      'site_type_id',
      'difficulty_id',
      'depth_min',
      'visibility_min',
      'rating_min',
    ] as const;

    for (const param of numericParams) {
      if (searchParams.has(param)) {
        const value = searchParams.get(param);
        if (value !== null && value !== '') {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            filters[param] = numValue;
          } else {
            // Нечисловые значения вызывают ошибку валидации
            validationErrors.push(`Invalid ${param}: must be a positive number`);
          }
        }
      }
    }

    // Обработка статуса
    if (searchParams.has('status')) {
      const statusValue = searchParams.get('status');
      if (statusValue !== null && statusValue !== '') {
        filters.status = statusValue as 'draft' | 'published' | 'rejected';
      }
    }

    // Проверяем ошибки валидации параметров
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid filter parameters',
          details: validationErrors,
        },
        { status: 400 },
      );
    }

    // Валидируем параметры
    const validation = validateFilters(filters);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Invalid filter parameters',
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    let result;

    // Обрабатываем комбинированные фильтры
    if (filters.region_id) {
      // Фильтрация по региону + дополнительные фильтры
      result = await filterByRegion(filters.region_id, filters);
    } else if (filters.location_id) {
      // Фильтрация по локации + дополнительные фильтры
      result = await filterByLocation(filters.location_id, filters);
    } else {
      // Используем стандартную фильтрацию
      const query = buildFilteredQuery(filters);
      result = await query;
    }

    const { data: sites, error } = result;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(sites);
  } catch (err) {
    console.error('Error fetching dive sites:', err);
    return NextResponse.json({ error: 'Failed to fetch dive sites' }, { status: 500 });
  }
}
