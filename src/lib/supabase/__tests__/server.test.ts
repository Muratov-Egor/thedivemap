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
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          then: jest.fn((callback) => callback({ data: [], error: null })),
        })),
      })),
    })),
  })),
}));

// Мокаем next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => [{ name: 'test-cookie', value: 'test-value' }]),
    set: jest.fn(),
  })),
}));

// Мокаем process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('server', () => {
  it('экспортирует функцию createClient', async () => {
    const { createClient } = await import('../server');

    expect(createClient).toBeDefined();
    expect(typeof createClient).toBe('function');
  });

  it('создает серверный клиент с правильными параметрами', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { createClient } = await import('../server');

    const client = await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    );

    expect(client).toBeDefined();
    expect(typeof client).toBe('object');
  });

  it('имеет метод from', async () => {
    const { createClient } = await import('../server');

    const client = await createClient();
    expect(client.from).toBeDefined();
    expect(typeof client.from).toBe('function');
  });

  it('обрабатывает ошибки при установке cookies', async () => {
    const { cookies } = await import('next/headers');
    const mockCookies = {
      getAll: jest.fn(() => []),
      set: jest.fn(() => {
        throw new Error('Cookie set error');
      }),
    };
    (cookies as jest.Mock).mockReturnValue(mockCookies);

    const { createClient } = await import('../server');

    // Не должно выбрасывать ошибку
    const client = await createClient();
    expect(client).toBeDefined();
  });

  it('использует правильные переменные окружения', async () => {
    const { createServerClient } = await import('@supabase/ssr');
    const { createClient } = await import('../server');

    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      expect.any(Object),
    );
  });
});
