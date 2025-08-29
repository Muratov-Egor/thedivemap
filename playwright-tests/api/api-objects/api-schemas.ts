// Схемы API для тестирования

/**
 * Ожидаемые поля для dive site объекта
 */
export const EXPECTED_DIVE_SITE_FIELDS = [
  'id',
  'name',
  'latitude',
  'longitude',
  'country_id',
  'depth_max',
  'visibility',
  'rating',
  'site_type_id',
  'difficulty_id',
  'status',
  'description',
  'info_links',
  'dive_center_links',
  'created_at',
  'country',
  'site_type',
  'difficulty',
] as const;

/**
 * Типы полей для dive site объекта
 */
export const DIVE_SITE_FIELD_TYPES = {
  id: 'string',
  name: 'string',
  latitude: 'number',
  longitude: 'number',
  country_id: 'number',
  depth_max: 'number',
  visibility: 'number',
  rating: 'number',
  site_type_id: 'number',
  difficulty_id: 'number',
  status: ['draft', 'published', 'rejected'],
  description: 'string', // nullable
  info_links: 'array',
  dive_center_links: 'array',
  created_at: 'string',
  country: 'object',
  site_type: 'object',
  difficulty: 'object',
} as const;

/**
 * Допустимые значения для статуса dive site
 */
export const DIVE_SITE_STATUSES = ['draft', 'published', 'rejected'] as const;
