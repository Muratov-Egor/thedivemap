'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout, AuthForm } from '@/components/auth';
import { AuthFormConfig } from '@/hooks/useAuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { signUp, user, loading } = useAuth();

  // Редирект если пользователь уже авторизован
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleRegister = async (formData: Record<string, string>) => {
    try {
      await signUp(formData.email, formData.password, formData.name);
      
      // После успешной регистрации редирект на главную
      router.push('/');
    } catch (error) {
      // Ошибки обрабатываются в AuthContext
      console.error('Ошибка при регистрации:', error);
    }
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

  // Показываем загрузку пока проверяем состояние аутентификации
  if (loading) {
    return (
      <AuthLayout title={t('auth.register.title')}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-tropical-blue border-t-transparent"></div>
          <span className="ml-2 text-sm text-muted-foreground">Загрузка...</span>
        </div>
      </AuthLayout>
    );
  }

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
