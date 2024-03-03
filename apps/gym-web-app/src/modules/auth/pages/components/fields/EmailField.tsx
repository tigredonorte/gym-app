import React from 'react';
import { InputField, InputFieldProps, mergeValidators } from '../FormModule/InputField';
import { isEmailValid } from './validateInput';

interface EmailFieldProps extends InputFieldProps<string> {}

export const EmailField: React.FC<EmailFieldProps> = ({ value, validators, ...props }: EmailFieldProps) => (
  <InputField
    {...props}
    type="email"
    label="Email"
    name="email"
    value={value}
    validators={mergeValidators(isEmailValid, validators)}
  />
)