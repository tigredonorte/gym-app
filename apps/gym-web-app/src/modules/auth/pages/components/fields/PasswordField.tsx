import React from 'react';
import { InputField, InputFieldProps, mergeValidators } from '@gym-app/total-form';
import { isPasswordValid } from './validateInput';

interface PasswordFieldProps extends InputFieldProps<string> {}

export const PasswordField: React.FC<PasswordFieldProps> = ({ validators, name, ...props }: PasswordFieldProps) => (
  <InputField
    type="password"
    label="Password"
    name={name || 'password'}
    {...props}
    validators={mergeValidators(validators, isPasswordValid)}
  />
);