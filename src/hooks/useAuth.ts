import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Реэкспорт хука из контекста для удобства использования
export const useAuth = useAuthContext;

// Дополнительные утилитарные хуки для аутентификации
export function useAuthState() {
  const { user, session, loading, error } = useAuth();
  
  return {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    isGuest: !user && !loading,
  };
}

export function useAuthActions() {
  const { signIn, signUp, signOut, resetPassword, clearError } = useAuth();
  
  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    clearError,
  };
}
