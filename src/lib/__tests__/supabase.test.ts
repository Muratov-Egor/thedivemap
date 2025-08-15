// Мокаем проблемные зависимости
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          then: jest.fn((callback) => callback({ data: [], error: null })),
        })),
      })),
    })),
  })),
}));

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          then: jest.fn((callback) => callback({ data: [], error: null })),
        })),
      })),
    })),
  })),
}));

describe('supabase', () => {
  it('экспортирует supabase клиент', async () => {
    // Динамический импорт для избежания проблем с ESM
    const { supabase } = await import('../supabase');

    expect(supabase).toBeDefined();
    expect(typeof supabase).toBe('object');
  });

  it('имеет метод from', async () => {
    const { supabase } = await import('../supabase');

    expect(supabase.from).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });
});
