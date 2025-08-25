'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { UserSession, User } from '@/lib/auth/session';
import { AuthError } from '@/lib/auth/errors';
import { getCurrentSession, getCurrentUser, onAuthStateChange } from '@/lib/auth/session';
import { signIn, signUp, signOut, resetPassword } from '@/lib/auth/auth';

interface AuthContextType {
  // Состояние
  user: User | null;
  session: UserSession | null;
  loading: boolean;
  error: AuthError | null;

  // Действия
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { t } = useTranslation('common');
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Инициализация состояния аутентификации
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Получаем текущую сессию
        const sessionResponse = await getCurrentSession();
        if (sessionResponse.error) {
          // Не выводим ошибку если сессия просто отсутствует (это нормально)
          if (sessionResponse.error.message !== 'Auth session missing!') {
            console.error('Ошибка при получении сессии:', sessionResponse.error);
          }
          setLoading(false);
          return;
        }

        if (sessionResponse.data) {
          setSession(sessionResponse.data);
          setUser(sessionResponse.data.user);
        } else {
          // Если сессии нет, проверяем пользователя
          const userResponse = await getCurrentUser();
          if (userResponse.error) {
            // Не выводим ошибку если пользователь просто не авторизован
            if (userResponse.error.message !== 'Auth session missing!') {
              console.error('Ошибка при получении пользователя:', userResponse.error);
            }
          } else if (userResponse.data) {
            setUser(userResponse.data);
          }
        }
      } catch (error) {
        console.error('Ошибка при инициализации аутентификации:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Подписываемся на изменения состояния аутентификации
    const {
      data: { subscription },
    } = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);

      if (session) {
        setSession(session);
        setUser(session.user);
        setError(null);
      } else {
        setSession(null);
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Функция входа в систему
  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await signIn({ email, password }, t);

      if (response.error) {
        // Специальная обработка для неподтвержденного email
        if (response.error.code === 'email_not_confirmed') {
          setError({
            message: t('auth.errors.emailNotConfirmed'),
            code: 'email_not_confirmed',
            status: 400,
          });
        } else {
          setError(response.error);
        }
        return;
      }

      if (response.data) {
        setSession(response.data);
        setUser(response.data.user);
      }
    } catch {
      setError({
        message: t('auth.errors.generalError'),
        code: 'unknown_error',
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция регистрации
  const handleSignUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await signUp({ email, password, name }, t);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setSession(response.data);
        setUser(response.data.user);
      }
    } catch {
      setError({
        message: t('auth.errors.generalError'),
        code: 'unknown_error',
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода из системы
  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await signOut();

      if (response.error) {
        setError(response.error);
        return;
      }

      setSession(null);
      setUser(null);
    } catch {
      setError({
        message: t('auth.unexpected_error_message'),
        code: 'unknown_error',
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция сброса пароля
  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await resetPassword({ email });

      if (response.error) {
        setError(response.error);
        return;
      }
    } catch {
      setError({
        message: t('auth.unexpected_error_message'),
        code: 'unknown_error',
        status: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция очистки ошибки
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Хук для использования контекста аутентификации
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
