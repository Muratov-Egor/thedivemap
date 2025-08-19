import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DiveSiteDetails } from '@/lib/types/supabase';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Валидация UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: 'Invalid site ID format' }, { status: 400 });
    }

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

    // Преобразуем данные в нужный формат
    const diveSiteDetails: DiveSiteDetails = {
      ...site,
      country: site.country,
      site_type: site.site_type,
      difficulty: site.difficulty,
      site_locations: site.site_locations || [],
      images: site.images || [],
    };

    return NextResponse.json(diveSiteDetails);
  } catch (err) {
    console.error('Error fetching dive site details:', err);
    return NextResponse.json({ error: 'Failed to fetch dive site details' }, { status: 500 });
  }
}
