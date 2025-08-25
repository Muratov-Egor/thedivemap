import { supabase } from '../supabase';
import { AuthResponse, createAuthSuccess, createAuthErrorResponse, AUTH_ERROR_CODES, AuthErrorCode, translateAuthError } from './errors';
import { UserSession } from './session';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

// Регистрация пользователя
export async function signUp(data: SignUpData, t?: (key: string) => string): Promise<AuthResponse<UserSession>> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          full_name: data.name,
          display_name: data.name,
        },
      },
    });

    if (error) {
      let errorCode = 'unknown_error';
      
      if (error.message.includes('Invalid email')) {
        errorCode = AUTH_ERROR_CODES.INVALID_EMAIL;
      } else if (error.message.includes('Password')) {
        errorCode = AUTH_ERROR_CODES.WEAK_PASSWORD;
      } else if (error.message.includes('already registered')) {
        errorCode = AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS;
      }

      return createAuthErrorResponse(
        translateAuthError(error.message, t),
        errorCode as AuthErrorCode,
        error.status || 400
      );
    }

    if (!authData.session || !authData.user) {
      return createAuthErrorResponse(
        'Ошибка при создании аккаунта',
        'unknown_error',
        500
      );
    }

    const userSession: UserSession = {
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        name: authData.user.user_metadata?.display_name || authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || undefined,
        created_at: authData.user.created_at,
        updated_at: authData.user.updated_at || authData.user.created_at,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at || 0,
      },
    };

    return createAuthSuccess(userSession);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при регистрации',
      'unknown_error',
      500
    );
  }
}

// Вход в систему
export async function signIn(data: SignInData, t?: (key: string) => string): Promise<AuthResponse<UserSession>> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      let errorCode = 'unknown_error';
      
      if (error.message.includes('Invalid login credentials')) {
        errorCode = AUTH_ERROR_CODES.INVALID_CREDENTIALS;
      } else if (error.message.includes('Email not confirmed')) {
        errorCode = AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED;
      } else if (error.message.includes('User not found')) {
        errorCode = AUTH_ERROR_CODES.USER_NOT_FOUND;
      }

      return createAuthErrorResponse(
        translateAuthError(error.message, t),
        errorCode as AuthErrorCode,
        error.status || 400
      );
    }

    if (!authData.session || !authData.user) {
      return createAuthErrorResponse(
        'Ошибка при входе в систему',
        'unknown_error',
        500
      );
    }

    const userSession: UserSession = {
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        name: authData.user.user_metadata?.display_name || authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || undefined,
        created_at: authData.user.created_at,
        updated_at: authData.user.updated_at || authData.user.created_at,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at || 0,
      },
    };

    return createAuthSuccess(userSession);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при входе в систему',
      'unknown_error',
      500
    );
  }
}

// Выход из системы
export async function signOut(): Promise<AuthResponse<void>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return createAuthErrorResponse(
        error.message,
        'unknown_error',
        error.status || 500
      );
    }

    return createAuthSuccess(undefined);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при выходе из системы',
      'unknown_error',
      500
    );
  }
}

// Сброс пароля
export async function resetPassword(data: ResetPasswordData): Promise<AuthResponse<void>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      let errorCode = 'unknown_error';
      
      if (error.message.includes('Invalid email')) {
        errorCode = AUTH_ERROR_CODES.INVALID_EMAIL;
      } else if (error.message.includes('User not found')) {
        errorCode = AUTH_ERROR_CODES.USER_NOT_FOUND;
      }

      return createAuthErrorResponse(
        error.message,
        errorCode as AuthErrorCode,
        error.status || 400
      );
    }

    return createAuthSuccess(undefined);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при сбросе пароля',
      'unknown_error',
      500
    );
  }
}

// Обновление пароля
export async function updatePassword(newPassword: string): Promise<AuthResponse<UserSession>> {
  try {
    const { data: authData, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      let errorCode = 'unknown_error';
      
      if (error.message.includes('Password')) {
        errorCode = AUTH_ERROR_CODES.WEAK_PASSWORD;
      }

      return createAuthErrorResponse(
        error.message,
        errorCode as AuthErrorCode,
        error.status || 400
      );
    }

    if (!authData.user) {
      return createAuthErrorResponse(
        'Ошибка при обновлении пароля',
        'unknown_error',
        500
      );
    }

    // Для updatePassword Supabase не возвращает session, поэтому создаем базовую структуру
    const userSession: UserSession = {
      user: {
        id: authData.user.id,
        email: authData.user.email || '',
        created_at: authData.user.created_at,
        updated_at: authData.user.updated_at || authData.user.created_at,
      },
      session: {
        access_token: '', // Будет обновлено при следующем входе
        refresh_token: '', // Будет обновлено при следующем входе
        expires_at: 0,
      },
    };

    return createAuthSuccess(userSession);
  } catch {
    return createAuthErrorResponse(
      'Ошибка при обновлении пароля',
      'unknown_error',
      500
    );
  }
}
