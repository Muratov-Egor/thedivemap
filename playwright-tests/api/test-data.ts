// Реальные данные из API для использования в тестах
export const TEST_DATA = {
  // Реальные ID стран из данных
  COUNTRIES: {
    THAILAND: 170, // Thailand
    MONTENEGRO: 113, // Montenegro
    SERBIA: 150, // Serbia
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
};
