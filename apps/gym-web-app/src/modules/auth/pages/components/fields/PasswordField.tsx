import React from 'react';
import { InputField, InputFieldProps } from '../FormModule/InputField';
import { isPasswordValid } from './validateInput';

interface PasswordFieldProps extends InputFieldProps<string> {}

export const PasswordField = ({ value, ...props }: PasswordFieldProps) => (
  <InputField
    {...props}
    type="password"
    label="Password"
    name="password"
    value={value}
    validators={isPasswordValid}
  />
);