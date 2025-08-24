'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header/Header';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Input from '@/components/ui/Input';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Валидация email
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return t('auth.login.validation.emailRequired');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('auth.login.validation.emailInvalid');
    }

    return undefined;
  };

  // Валидация пароля
  const validatePassword = (password: string): string | undefined => {
    if (!password.trim()) {
      return t('auth.login.validation.passwordRequired');
    }

    if (password.length < 6) {
      return t('auth.login.validation.passwordMinLength');
    }

    return undefined;
  };

  // Обработка изменения полей
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Очищаем ошибку для этого поля при вводе
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    console.log('Email validation result:', emailError);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(formData.password);
    console.log('Password validation result:', passwordError);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    console.log('All errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, validating...');

    if (!validateForm()) {
      console.log('Validation failed, form not submitted');
      return;
    }

    setIsSubmitting(true);

    try {
      // Имитация задержки для демонстрации состояния загрузки
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Выводим данные в консоль для проверки
      console.log('=== ЛОГИН ФОРМА ===');
      console.log('Email:', formData.email);
      console.log('Password:', formData.password);
      console.log('Время отправки:', new Date().toISOString());
      console.log('==================');

      // Здесь будет подключение к реальному бэкенду
      // const response = await loginUser(formData);
    } catch (error) {
      console.error('Ошибка при входе:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-full w-full flex flex-col min-h-screen bg-background transition-colors">
      <Header />

      <div className="flex flex-col items-center justify-center gap-6 flex-1 px-4">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.login.title')}</h1>
            </div>

            <div className="space-y-4">
              <Input
                type="email"
                label={t('auth.login.email')}
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                disabled={isSubmitting}
              />

              <Input
                type="password"
                label={t('auth.login.password')}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              {t('auth.login.submit')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.login.noAccount')}{' '}
              <Link
                href="/register"
                className="text-primary-action hover:text-primary-action/80 underline transition-colors"
              >
                {t('auth.login.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
