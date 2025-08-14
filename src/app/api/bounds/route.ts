import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing required parameters: type and id' },
        { status: 400 },
      );
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid id parameter: must be a number' },
        { status: 400 },
      );
    }

    let query;

    switch (type) {
      case 'country':
        // Получаем границы всех сайтов в стране
        query = supabase.from('sites').select('longitude, latitude').eq('country_id', numericId);
        break;

      case 'region':
        // Получаем границы всех сайтов в регионе
        const { data: countries, error: countriesError } = await supabase
          .from('countries')
          .select('id')
          .eq('region_id', numericId);

        if (countriesError) throw countriesError;

        const countryIds = countries.map((c) => c.id);
        query = supabase.from('sites').select('longitude, latitude').in('country_id', countryIds);
        break;

      case 'location':
        // Получаем границы всех сайтов в локации
        const { data: siteLocations, error: siteLocationsError } = await supabase
          .from('site_locations')
          .select('site_id')
          .eq('location_id', numericId);

        if (siteLocationsError) throw siteLocationsError;

        const siteIds = siteLocations.map((sl) => sl.site_id);
        query = supabase.from('sites').select('longitude, latitude').in('id', siteIds);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter: must be country, region, or location' },
          { status: 400 },
        );
    }

    const { data: sites, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!sites || sites.length === 0) {
      return NextResponse.json(
        { error: 'No sites found for the specified criteria' },
        { status: 404 },
      );
    }

    // Вычисляем границы
    const longitudes = sites.map((site) => site.longitude);
    const latitudes = sites.map((site) => site.latitude);

    const bounds = [
      Math.min(...longitudes), // minLng
      Math.min(...latitudes), // minLat
      Math.max(...longitudes), // maxLng
      Math.max(...latitudes), // maxLat
    ];

    return NextResponse.json(bounds);
  } catch (err) {
    console.error('Error fetching bounds:', err);
    return NextResponse.json({ error: 'Failed to fetch bounds' }, { status: 500 });
  }
}
