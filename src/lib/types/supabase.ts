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

export interface Difficulty {
  id: number;
  label_ru: string;
  label_en: string;
}

export interface Image {
  id: string;
  site_id: string;
  url: string;
  uploaded_at: string;
}

export interface SiteLocation {
  site_id: string;
  location_id: number;
  location: Location;
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  country_id: number;
  depth_max: number;
  visibility: number;
  info_links?: string[];
  dive_center_links?: string[];
  created_at: string;
  rating?: number;
  site_type_id: number;
  difficulty_id: number;
  status: 'draft' | 'published' | 'rejected';
  country?: Country & {
    region?: Region;
  };
  site_type?: SiteType;
  difficulty?: Difficulty;
  site_locations?: SiteLocation[];
  images?: Image[];
}

// Тип для полной информации о дайв-сайте
export interface DiveSiteDetails extends Site {
  country: Country & {
    region: Region;
  };
  site_type: SiteType;
  difficulty: Difficulty;
  site_locations: SiteLocation[];
  images: Image[];
}
