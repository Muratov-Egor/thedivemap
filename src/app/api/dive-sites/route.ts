import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: sites, error } = await supabase.from('sites').select(`
        *,
        country:countries(*),
        site_type:site_types(*),
        difficulty:difficulties(*)
      `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(sites);
  } catch (err) {
    console.error('Error fetching dive sites:', err);
    return NextResponse.json({ error: 'Failed to fetch dive sites' }, { status: 500 });
  }
}
