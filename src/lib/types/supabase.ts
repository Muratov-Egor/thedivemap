export interface Location {
  id: number;
  name_ru: string;
  name_en: string;
  country_id: number;
  region_id: number;
}

export interface Country {
  id: number;
  name_ru: string;
  name_en: string;
  region_id: number;
  iso_code: string;
}

export interface Region {
  id: number;
  name_ru: string;
  name_en: string;
}

export interface SiteType {
  id: number;
  label_ru: string;
  label_en: string;
}

export interface Site {
  id: string;
  name: string;
  country_id: number;
  site_type_id: number;
  country?: {
    name_ru?: string;
    name_en?: string;
    region?: {
      name_ru?: string;
      name_en?: string;
    };
  };
  site_type?: {
    label_ru?: string;
    label_en?: string;
  };
  site_locations?: Array<{
    location: {
      name_ru?: string;
      name_en?: string;
    };
  }>;
}
