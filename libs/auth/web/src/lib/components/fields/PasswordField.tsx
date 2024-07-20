import { InputField, InputFieldProps, mergeValidators } from '@gym-app/total-form';
import React from 'react';
import { isPasswordValid } from './validateInput';

type PasswordFieldProps = InputFieldProps<string>

export const PasswordField: React.FC<PasswordFieldProps> = React.memo(({ validators, name, ...props }: PasswordFieldProps) => (
  <InputField
    type="password"
    label="Password"
    name={name || 'password'}
    {...props}
    validators={mergeValidators(isPasswordValid, validators)}
  />
));