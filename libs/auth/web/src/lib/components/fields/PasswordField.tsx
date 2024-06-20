import { InputField, InputFieldProps, mergeValidators } from '@gym-app/total-form';
import React from 'react';
import { isPasswordValid } from './validateInput';

type PasswordFieldProps = InputFieldProps<string>

export const PasswordField: React.FC<PasswordFieldProps> = ({ validators, name, ...props }: PasswordFieldProps) => (
  <InputField
    type="password"
    label="Password"
    name={name || 'password'}
    {...props}
    validators={mergeValidators(validators, isPasswordValid)}
  />
);