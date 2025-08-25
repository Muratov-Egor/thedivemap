'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout, AuthForm } from '@/components/auth';
import { AuthFormConfig } from '@/hooks/useAuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function LoginPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { signIn, user, loading } = useAuth();

  // Редирект если пользователь уже авторизован
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogin = async (formData: Record<string, string>) => {
    try {
      await signIn(formData.email, formData.password);

      // Проверяем, что нет ошибок после попытки входа
      // Если ошибок нет и пользователь авторизован, редирект произойдет автоматически
      // через useEffect выше
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  };

  const loginConfig: AuthFormConfig = {
    fields: [
      {
        name: 'email',
        type: 'email',
        label: t('auth.login.email'),
        placeholder: 'example@email.com',
        required: true,
      },
      {
        name: 'password',
        type: 'password',
        label: t('auth.login.password'),
        placeholder: '••••••••',
        required: true,
      },
    ],
    onSubmit: handleLogin,
  };

  const bottomText = (
    <p className="text-sm text-muted-foreground">
      {t('auth.login.noAccount')}{' '}
      <Link
        href="/register"
        className="text-primary-action hover:text-primary-action/80 underline transition-colors"
      >
        {t('auth.login.register')}
      </Link>
    </p>
  );

  // Показываем загрузку пока проверяем состояние аутентификации
  if (loading) {
    return (
      <AuthLayout title={t('auth.login.title')}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-tropical-blue border-t-transparent"></div>
          <span className="ml-2 text-sm text-muted-foreground">Загрузка...</span>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('auth.login.title')}>
      <AuthForm
        config={loginConfig}
        submitButtonText={t('auth.login.submit')}
        bottomText={bottomText}
      />
    </AuthLayout>
  );
}
