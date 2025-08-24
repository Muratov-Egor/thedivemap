export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthErrorResponse {
  error: AuthError;
  data: null;
}

export interface AuthSuccessResponse<T = unknown> {
  error: null;
  data: T;
}

export type AuthResponse<T = unknown> = AuthSuccessResponse<T> | AuthErrorResponse;

// Типы ошибок Supabase Auth
export const AUTH_ERROR_CODES = {
  INVALID_EMAIL: 'invalid_email',
  WEAK_PASSWORD: 'weak_password',
  EMAIL_NOT_CONFIRMED: 'email_not_confirmed',
  INVALID_CREDENTIALS: 'invalid_credentials',
  USER_NOT_FOUND: 'user_not_found',
  EMAIL_ALREADY_EXISTS: 'email_already_exists',
  NETWORK_ERROR: 'network_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES];

// Функция для создания ошибки аутентификации
export function createAuthError(
  message: string,
  code?: AuthErrorCode,
  status?: number
): AuthError {
  return {
    message,
    code,
    status,
  };
}

// Функция для создания успешного ответа
export function createAuthSuccess<T>(data: T): AuthSuccessResponse<T> {
  return {
    error: null,
    data,
  };
}

// Функция для создания ответа с ошибкой
export function createAuthErrorResponse(
  message: string,
  code?: AuthErrorCode,
  status?: number
): AuthErrorResponse {
  return {
    error: createAuthError(message, code, status),
    data: null,
  };
}
