import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface AuthField {
  name: string;
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  required?: boolean;
  validation?: (value: string, formData?: Record<string, string>) => string | undefined;
}

export interface AuthFormConfig {
  fields: AuthField[];
  onSubmit: (formData: Record<string, string>) => Promise<void>;
}

export interface AuthFormState {
  formData: Record<string, string>;
  errors: Record<string, string | undefined>;
  isSubmitting: boolean;
}

export const useAuthForm = (config: AuthFormConfig) => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    config.fields.forEach((field) => {
      initialData[field.name] = '';
    });
    return initialData;
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Стандартные валидации
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return t('auth.validation.emailRequired');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('auth.validation.emailInvalid');
    }

    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password.trim()) {
      return t('auth.validation.passwordRequired');
    }

    if (password.length < 6) {
      return t('auth.validation.passwordMinLength');
    }

    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword.trim()) {
      return t('auth.validation.confirmPasswordRequired');
    }

    if (confirmPassword !== formData.password) {
      return t('auth.validation.passwordsDoNotMatch');
    }

    return undefined;
  };

  // Обработка изменения полей
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Очищаем ошибку для этого поля при вводе
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    config.fields.forEach((field) => {
      const value = formData[field.name];
      let error: string | undefined;

      // Проверяем обязательность поля
      if (field.required && !value.trim()) {
        error = t('auth.validation.fieldRequired', { field: field.label });
      }

      // Применяем стандартные валидации
      if (!error && field.type === 'email') {
        error = validateEmail(value);
      }

      if (!error && field.type === 'password' && field.name === 'password') {
        error = validatePassword(value);
      }

      if (!error && field.name === 'confirmPassword') {
        error = validateConfirmPassword(value);
      }

      // Применяем кастомную валидацию
      if (!error && field.validation) {
        error = field.validation(value, formData);
      }

      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await config.onSubmit(formData);
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    validateForm,
  };
};
