import { Button } from './ui';

// Простые иконки для демонстрации
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

export default function Stub() {
  return (
    <div className="hidden md:flex flex-col justify-start items-center md:w-[1000px] border-l border-gray-200 p-6 overflow-y-auto max-h-screen">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Демонстрация кнопок</h2>

      {/* Размеры */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Размеры</h3>
        <div className="flex items-center gap-3">
          <Button size="small">Маленькая</Button>
          <Button size="medium">Средняя</Button>
          <Button size="large">Большая</Button>
          <Button size="xl">Очень большая</Button>
        </div>
      </section>

      {/* Варианты стилей */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Варианты стилей</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="coral">Coral</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="success">Success</Button>
        </div>
      </section>

      {/* Формы */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Формы</h3>
        <div className="flex items-center gap-3">
          <Button shape="rounded">Прямоугольная</Button>
          <Button shape="circle" icon={<PlusIcon />} />
          <Button shape="pill">Pill</Button>
        </div>
      </section>

      {/* Контент */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Типы контента</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20">Только текст:</span>
            <Button>Кнопка</Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20">Текст + иконка:</span>
            <Button icon={<SearchIcon />}>Поиск</Button>
            <Button icon={<ArrowRightIcon />} iconPosition="right">
              Далее
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20">Только иконка:</span>
            <Button icon={<HeartIcon />} />
            <Button icon={<StarIcon />} />
          </div>
        </div>
      </section>

      {/* Состояния */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Состояния</h3>
        <div className="flex items-center gap-3">
          <Button>Обычная</Button>
          <Button disabled>Отключена</Button>
          <Button loading>Загрузка</Button>
        </div>
      </section>

      {/* Эффекты */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Эффекты</h3>
        <div className="flex items-center gap-3">
          <Button shimmer>Shimmer</Button>
          <Button glow>Glow</Button>
          <Button shimmer glow>Shimmer + Glow</Button>
        </div>
      </section>

      {/* Эффект блика */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Эффект блика при ховере</h3>
        <div className="flex items-center gap-3">
          <Button variant="primary">Primary с бликом</Button>
          <Button variant="coral">Coral с бликом</Button>
          <Button variant="glass">Glass с бликом</Button>
          <Button variant="success">Success с бликом</Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Наведите курсор на кнопки, чтобы увидеть эффект блика</p>
      </section>

      {/* Комбинации */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Комбинации</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button size="large" variant="primary" icon={<SearchIcon />}>
            Большой поиск
          </Button>
          <Button size="small" variant="glass" icon={<HeartIcon />}>
            Маленькое избранное
          </Button>
          <Button size="medium" variant="coral" shape="circle" icon={<PlusIcon />} />
          <Button size="large" variant="ghost" icon={<ArrowRightIcon />} iconPosition="right">
            Перейти
          </Button>
          <Button size="small" variant="secondary" loading>
            Загрузка
          </Button>
          <Button size="medium" variant="primary" disabled>
            Недоступно
          </Button>
        </div>
      </section>

      {/* Круглые кнопки разных размеров */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Круглые кнопки</h3>
        <div className="flex items-center gap-3">
          <Button size="small" shape="circle" icon={<PlusIcon />} />
          <Button size="medium" shape="circle" icon={<SearchIcon />} />
          <Button size="large" shape="circle" icon={<HeartIcon />} />
        </div>
      </section>

      {/* Все варианты стилей в круглой форме */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Круглые стили</h3>
        <div className="flex items-center gap-3">
          <Button variant="primary" shape="circle" icon={<StarIcon />} />
          <Button variant="secondary" shape="circle" icon={<StarIcon />} />
          <Button variant="coral" shape="circle" icon={<StarIcon />} />
          <Button variant="glass" shape="circle" icon={<StarIcon />} />
          <Button variant="ghost" shape="circle" icon={<StarIcon />} />
          <Button variant="success" shape="circle" icon={<StarIcon />} />
        </div>
      </section>

      {/* Кнопки с иконками справа */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Иконки справа</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button icon={<ArrowRightIcon />} iconPosition="right">
            Далее
          </Button>
          <Button variant="glass" icon={<ArrowRightIcon />} iconPosition="right">
            Продолжить
          </Button>
          <Button variant="ghost" icon={<ArrowRightIcon />} iconPosition="right">
            Следующий
          </Button>
        </div>
      </section>

      {/* Кнопки в состоянии загрузки */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Состояние загрузки</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button loading>Загрузка...</Button>
          <Button variant="secondary" loading>
            Сохранение
          </Button>
          <Button variant="glass" loading>
            Отправка
          </Button>
          <Button shape="circle" loading />
        </div>
      </section>

      {/* Отключенные кнопки */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Отключенные кнопки</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Недоступно</Button>
          <Button variant="secondary" disabled>
            Заблокировано
          </Button>
          <Button variant="glass" disabled>
            Неактивно
          </Button>
          <Button shape="circle" disabled icon={<PlusIcon />} />
        </div>
      </section>

      {/* Интересные комбинации */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Интересные комбинации</h3>
        <div className="grid grid-cols-1 gap-3">
          <Button size="large" variant="primary" icon={<SearchIcon />}>
            🔍 Основной поиск
          </Button>
          <Button size="large" variant="secondary" icon={<HeartIcon />}>
            💛 Вторичное сердце
          </Button>
          <Button size="large" variant="coral" icon={<StarIcon />}>
            🧡 Коралловая звезда
          </Button>
          <Button size="large" variant="glass" icon={<PlusIcon />}>
            💎 Стеклянное добавление
          </Button>
          <Button size="large" variant="ghost" icon={<ArrowRightIcon />}>
            👻 Призрачный переход
          </Button>
          <Button size="large" variant="success" icon={<PlusIcon />}>
            ✅ Успешное добавление
          </Button>
          <Button size="large" variant="coral" icon={<ArrowRightIcon />}>
            ⚠️ Коралловое действие
          </Button>
        </div>
      </section>

      {/* Кнопки с эффектами */}
      <section className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Кнопки с эффектами</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" shimmer>
            Primary Shimmer
          </Button>
          <Button variant="coral" glow>
            Coral Glow
          </Button>
          <Button variant="primary" shimmer glow>
            Primary Shimmer + Glow
          </Button>
          <Button variant="coral" shape="circle" glow>
            +
          </Button>
        </div>
      </section>
    </div>
  );
}
