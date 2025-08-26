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

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

// Функция для создания ошибки аутентификации
export function createAuthError(message: string, code?: AuthErrorCode, status?: number): AuthError {
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
  status?: number,
): AuthErrorResponse {
  return {
    error: createAuthError(message, code, status),
    data: null,
  };
}

// Функция для перевода технических ошибок Supabase в понятные пользователю сообщения
export function translateAuthError(errorMessage: string, t?: (key: string) => string): string {
  const message = errorMessage.toLowerCase();

  // Если функция перевода не передана, используем русские сообщения по умолчанию
  if (!t) {
    return translateAuthErrorDefault(errorMessage);
  }

  // Ошибки входа
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password')
  ) {
    return t('auth.errors.invalidCredentials');
  }

  if (message.includes('email not confirmed') || message.includes('email not verified')) {
    return t('auth.errors.emailNotConfirmed');
  }

  if (message.includes('user not found')) {
    return t('auth.errors.userNotFound');
  }

  // Ошибки регистрации
  if (message.includes('user already registered') || message.includes('email already exists')) {
    return t('auth.errors.emailAlreadyExists');
  }

  if (message.includes('invalid email')) {
    return t('auth.errors.invalidEmail');
  }

  if (message.includes('password') && message.includes('weak')) {
    return t('auth.errors.weakPassword');
  }

  if (message.includes('password') && message.includes('required')) {
    return t('auth.errors.passwordRequired');
  }

  // Сетевые ошибки
  if (message.includes('network') || message.includes('connection')) {
    return t('auth.errors.networkError');
  }

  if (message.includes('timeout')) {
    return t('auth.errors.timeout');
  }

  // Общие ошибки
  if (message.includes('too many requests') || message.includes('rate limit')) {
    return t('auth.errors.tooManyRequests');
  }

  // Если не удалось определить тип ошибки, возвращаем общее сообщение
  return t('auth.errors.generalError');
}

// Функция для перевода ошибок по умолчанию (русский)
function translateAuthErrorDefault(errorMessage: string): string {
  const message = errorMessage.toLowerCase();

  // Ошибки входа
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password')
  ) {
    return 'Неверный email или пароль. Проверьте правильность введенных данных.';
  }

  if (message.includes('email not confirmed') || message.includes('email not verified')) {
    return 'Email не подтвержден. Проверьте вашу почту и перейдите по ссылке для подтверждения.';
  }

  if (message.includes('user not found')) {
    return 'Пользователь с таким email не найден. Проверьте email или зарегистрируйтесь.';
  }

  // Ошибки регистрации
  if (message.includes('user already registered') || message.includes('email already exists')) {
    return 'Пользователь с таким email уже существует. Войдите в систему или используйте другой email.';
  }

  if (message.includes('invalid email')) {
    return 'Некорректный email. Проверьте правильность написания.';
  }

  if (message.includes('password') && message.includes('weak')) {
    return 'Пароль слишком простой. Используйте минимум 6 символов.';
  }

  if (message.includes('password') && message.includes('required')) {
    return 'Пароль обязателен для заполнения.';
  }

  // Сетевые ошибки
  if (message.includes('network') || message.includes('connection')) {
    return 'Ошибка соединения. Проверьте интернет-соединение и попробуйте снова.';
  }

  if (message.includes('timeout')) {
    return 'Превышено время ожидания. Попробуйте снова.';
  }

  // Общие ошибки
  if (message.includes('too many requests') || message.includes('rate limit')) {
    return 'Слишком много попыток. Подождите немного и попробуйте снова.';
  }

  // Если не удалось определить тип ошибки, возвращаем общее сообщение
  return 'Произошла ошибка при входе в систему. Попробуйте снова.';
}
