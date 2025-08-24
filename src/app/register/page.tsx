'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { AuthLayout, AuthForm } from '@/components/auth';
import { AuthFormConfig } from '@/hooks/useAuthForm';

export default function RegisterPage() {
  const { t } = useTranslation('common');

  const handleRegister = async (formData: Record<string, string>) => {
    // Имитация задержки для демонстрации состояния загрузки
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Выводим данные в консоль для проверки
    console.log('=== РЕГИСТРАЦИЯ ===');
    console.log('Name:', formData.name);
    console.log('Email:', formData.email);
    console.log('Password:', formData.password);
    console.log('Confirm Password:', formData.confirmPassword);
    console.log('Время отправки:', new Date().toISOString());
    console.log('==================');

    // Здесь будет подключение к реальному бэкенду
    // const response = await registerUser(formData);
  };

  const registerConfig: AuthFormConfig = {
    fields: [
      {
        name: 'name',
        type: 'text',
        label: t('auth.register.name'),
        placeholder: t('auth.register.namePlaceholder'),
        required: true,
      },
      {
        name: 'email',
        type: 'email',
        label: t('auth.register.email'),
        placeholder: 'example@email.com',
        required: true,
      },
      {
        name: 'password',
        type: 'password',
        label: t('auth.register.password'),
        placeholder: '••••••••',
        required: true,
      },
      {
        name: 'confirmPassword',
        type: 'password',
        label: t('auth.register.confirmPassword'),
        placeholder: '••••••••',
        required: true,
      },
    ],
    onSubmit: handleRegister,
  };

  const bottomText = (
    <p className="text-sm text-muted-foreground">
      {t('auth.register.haveAccount')}{' '}
      <Link
        href="/login"
        className="text-primary-action hover:text-primary-action/80 underline transition-colors"
      >
        {t('auth.register.login')}
      </Link>
    </p>
  );

  return (
    <AuthLayout title={t('auth.register.title')}>
      <AuthForm
        config={registerConfig}
        submitButtonText={t('auth.register.submit')}
        bottomText={bottomText}
      />
    </AuthLayout>
  );
}
