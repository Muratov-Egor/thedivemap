// Реальные данные из API для использования в тестах
export const TEST_DATA = {
  // Реальные ID стран из данных
  COUNTRIES: {
    THAILAND: 170, // Thailand
    MONTENEGRO: 113, // Montenegro
    SERBIA: 150, // Serbia
  },

  // Реальные названия стран из данных
  COUNTRIES_NAMES: {
    RU: {
      THAILAND: 'Тайланд',
      MONTENEGRO: 'Черногория',
      SERBIA: 'Сербия',
    },
    EN: {
      THAILAND: 'Thailand',
      MONTENEGRO: 'Montenegro',
      SERBIA: 'Serbia',
    },
  },

  // Реальные ID типов сайтов из данных
  SITE_TYPES: {
    REEF: 1, // Reef
    WRECK: 2, // Wreck
    CAVE: 3, // Cave
    BAY: 4, // Bay
    WALL: 5, // Wall
    ARTIFICIAL_REEF: 6, // Artificial reef
    PINNACLE: 9, // Pinnacle
    CORAL_GARDEN: 10, // Coral_garden
    LAKE: 11, // Lake
    DEFAULT: 12, // Default
  },

  // Реальные ID сложности из данных
  DIFFICULTY: {
    BEGINNER: 1, // Beginner
    INTERMEDIATE: 2, // Intermediate
    ADVANCED: 3, // Advanced
  },

  // Реальные ID регионов (из country.region_id)
  REGIONS: {
    ASIA: 2, // Thailand region
    EUROPE: 3, // Montenegro, Serbia region
  },

  // Реальные UUID дайв-сайтов для тестирования
  SITE_IDS: {
    VALID: '71e9c9ae-4295-4a37-b1ca-223a85edf0ab', // Mogren Cove
    INVALID: 'invalid-uuid-format',
  },

  // Реальные значения для тестирования фильтров
  FILTER_VALUES: {
    DEPTH_MIN: 15, // Реальная минимальная глубина
    VISIBILITY_MIN: 10, // Реальная минимальная видимость
    RATING_MIN: 4, // Реальный минимальный рейтинг
  },

  // Реальные значения для тестирования стран
  SERBIA_VALUES: {
    ID: 150,
    NAME_RU: 'Сербия',
    NAME_EN: 'Serbia',
    ISO_CODE: 'RS',
  },

  // Реальные значения для тестирования регионов
  REGIONS_VALUES: {
    ID: 2,
    NAME_RU: 'Азия',
    NAME_EN: 'Asia',
  },

  // Реальные значения для тестирования дайв-сайтов в автокомплите
  DIVE_SITES_VALUES: {
      ID: '02b914c4-c3d7-4181-badb-391ad8bf1e09',
      NAME: 'Ada Lake',
      COUNTRY_NAME_RU: 'Сербия',
      COUNTRY_NAME_EN: 'Serbia',
      REGION_NAME_RU: 'Европа',
      REGION_NAME_EN: 'Europe',
      SITE_TYPE_LABEL_RU: 'Озеро',
      SITE_TYPE_LABEL_EN: 'Lake',
      LOCATION_NAME_RU: 'Белград',
      LOCATION_NAME_EN: 'Belgrade',
  },

    
};