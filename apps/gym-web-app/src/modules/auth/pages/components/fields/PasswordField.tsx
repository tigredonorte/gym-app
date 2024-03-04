import React from 'react';
import { InputField, InputFieldProps, mergeValidators } from '@gym-app/total-form';
import { isPasswordValid } from './validateInput';

interface PasswordFieldProps extends InputFieldProps<string> {}

export const PasswordField: React.FC<PasswordFieldProps> = ({ validators, ...props }: PasswordFieldProps) => (
  <InputField
    {...props}
    type="password"
    label="Password"
    name="password"
    validators={mergeValidators(isPasswordValid, validators)}
  />
);