// Типы для базы данных The Dive Map

export interface Country {
  id: number;
  name_en: string;
  name_ru: string;
  region_id: number;
  iso_code: string;
}

export interface Region {
  id: number;
  name_en: string;
  name_ru: string;
}

export interface Location {
  id: number;
  name_en: string;
  country_id: number;
  region_id: number;
  name_ru: string;
}

export interface SiteType {
  id: number;
  label_en: string;
  label_ru: string;
}

export interface Difficulty {
  id: number;
  label_en: string;
  label_ru: string;
}

export interface Site {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  country_id: number;
  depth_max: number;
  visibility: number;
  info_links: string[] | null;
  dive_center_links: string[] | null;
  rating: number;
  site_type_id: number;
  difficulty_id: number;
  status: 'draft' | 'published' | 'rejected';
  created_at: string;
}

export interface SiteLocation {
  site_id: string;
  location_id: number;
}

export interface Image {
  id: string;
  site_id: string;
  url: string;
  uploaded_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at: string;
}

export interface SiteReview {
  id: string;
  site_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SiteVisit {
  id: string;
  user_id: string;
  site_id: string;
  visited_at: string;
}

export interface LogbookEntry {
  id: string;
  user_id: string;
  site_id: string;
  date: string;
  max_depth: number;
  duration_minutes: number;
  dive_buddy: string;
  notes: string;
  created_at: string;
}

// Расширенный тип для дайв-сайта с связанными данными
export interface SiteWithDetails extends Site {
  country?: Country;
  region?: Region;
  site_type?: SiteType;
  difficulty?: Difficulty;
  locations?: Location[];
  images?: Image[];
  reviews?: SiteReview[];
  visits?: SiteVisit[];
  logbook_entries?: LogbookEntry[];
}
