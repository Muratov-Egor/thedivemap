export default function FiltersLoader() {
  return (
    <div className="space-y-6 w-full">
      {/* Лоадер для автокомплита */}
      <div className="space-y-3">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 dark:bg-gray-700 h-12 w-full rounded-lg"></div>
      </div>

      {/* Лоадер для типа дайв-сайта */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 dark:bg-gray-700 h-4 w-24 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Лоадер для уровня сложности */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-28 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Лоадер для слайдеров */}
      <div className="space-y-4">
        {/* Лоадер для слайдера глубины */}
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-48 rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-full rounded"></div>
          <div className="flex justify-between">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-12 rounded"></div>
          </div>
        </div>

        {/* Лоадер для слайдера видимости */}
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-52 rounded"></div>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-full rounded"></div>
          <div className="flex justify-between">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-12 rounded"></div>
          </div>
        </div>

        {/* Лоадер для рейтинга */}
        <div className="space-y-3">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-16 rounded"></div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-6 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
