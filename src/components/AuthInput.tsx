
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  required?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  className,
  required = false,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(error && 'border-destructive focus-visible:ring-destructive')}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default AuthInput;
