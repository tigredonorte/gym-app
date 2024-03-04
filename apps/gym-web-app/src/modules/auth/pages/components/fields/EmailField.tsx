import React from 'react';
import Form, { InputFieldProps } from '@gym-app/total-form';
import { isEmailValid } from './validateInput';

interface EmailFieldProps extends InputFieldProps<string> {}

export const EmailField: React.FC<EmailFieldProps> = ({ value, validators, ...props }: EmailFieldProps) => (
  <Form.Input
    {...props}
    type="email"
    label="Email"
    name="email"
    value={value}
    validators={Form.mergeValidators(isEmailValid, validators)}
  />
)