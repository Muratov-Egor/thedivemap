import { supabase } from '../supabase';
import { AuthResponse, createAuthSuccess, createAuthErrorResponse } from './errors';

export interface UserSession {
  user: {
    id: string;
    email: string;
    name?: string;
    created_at: string;
    updated_at: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

// Получение текущей сессии
export async function getCurrentSession(): Promise<AuthResponse<UserSession | null>> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      // Если ошибка связана с отсутствием сессии, это нормально
      if (error.message.includes('Auth session missing')) {
        return createAuthSuccess(null);
      }
      
      return createAuthErrorResponse(
        error.message,
        'unknown_error',
        error.status || 500
      );
    }

    if (!session) {
      return createAuthSuccess(null);
    }

    const userSession: UserSession = {
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || undefined,
        created_at: session.user.created_at,
        updated_at: session.user.updated_at || session.user.created_at,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at || 0,
      },
    };

    return createAuthSuccess(userSession);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при получении сессии',
      'unknown_error',
      500
    );
  }
}

// Получение текущего пользователя
export async function getCurrentUser(): Promise<AuthResponse<User | null>> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      // Если ошибка связана с отсутствием пользователя, это нормально
      if (error.message.includes('Auth session missing')) {
        return createAuthSuccess(null);
      }
      
      return createAuthErrorResponse(
        error.message,
        'unknown_error',
        error.status || 500
      );
    }

    if (!user) {
      return createAuthSuccess(null);
    }

    const userData: User = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };

    return createAuthSuccess(userData);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при получении пользователя',
      'unknown_error',
      500
    );
  }
}

// Обновление сессии
export async function refreshSession(): Promise<AuthResponse<UserSession | null>> {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      return createAuthErrorResponse(
        error.message,
        'unknown_error',
        error.status || 500
      );
    }

    if (!session) {
      return createAuthSuccess(null);
    }

    const userSession: UserSession = {
      user: {
        id: session.user.id,
        email: session.user.email || '',
        created_at: session.user.created_at,
        updated_at: session.user.updated_at || session.user.created_at,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at || 0,
      },
    };

    return createAuthSuccess(userSession);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при обновлении сессии',
      'unknown_error',
      500
    );
  }
}

// Подписка на изменения аутентификации
export function onAuthStateChange(
  callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', session: UserSession | null) => void
) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      const userSession: UserSession = {
        user: {
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        },
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at || 0,
        },
      };
      callback(event as unknown as 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', userSession);
    } else {
      callback(event as unknown as 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', null);
    }
  });
}
