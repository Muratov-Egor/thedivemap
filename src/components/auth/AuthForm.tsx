import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthForm, AuthFormConfig } from '@/hooks/useAuthForm';
import { useAuth } from '@/hooks/useAuth';

interface AuthFormProps {
  config: AuthFormConfig;
  submitButtonText: string;
  bottomText?: React.ReactNode;
}

export default function AuthForm({ config, submitButtonText, bottomText }: AuthFormProps) {
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit } = useAuthForm(config);
  const { error: authError, clearError } = useAuth();

  // Auto-clear error after 10 seconds
  React.useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, clearError]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {/* Отображение глобальных ошибок аутентификации */}
      {authError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{authError.message}</p>
        </div>
      )}

      <div className="space-y-4">
        {config.fields.map((field) => (
          <Input
            key={field.name}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            error={errors[field.name]}
            disabled={isSubmitting}
            required={false}
          />
        ))}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={isSubmitting}
        disabled={isSubmitting}
        className="w-full"
      >
        {submitButtonText}
      </Button>

      {bottomText && <div className="mt-6 text-center">{bottomText}</div>}
    </form>
  );
}
