import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthForm, AuthFormConfig } from '@/hooks/useAuthForm';

interface AuthFormProps {
  config: AuthFormConfig;
  submitButtonText: string;
  bottomText?: React.ReactNode;
}

export default function AuthForm({ config, submitButtonText, bottomText }: AuthFormProps) {
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit } = useAuthForm(config);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
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
