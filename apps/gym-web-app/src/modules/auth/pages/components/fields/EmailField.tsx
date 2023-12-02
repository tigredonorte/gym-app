import React from 'react';
import { InputField, InputFieldProps } from '../FormModule/InputField';
import { isEmailValid } from './validateInput';

interface EmailFieldProps extends InputFieldProps<string> {}

export const EmailField = ({ value, ...props }: EmailFieldProps) => (
  <InputField
    {...props}
    type="email"
    label="Email"
    name="email"
    value={value}
    validators={isEmailValid}
  />
);