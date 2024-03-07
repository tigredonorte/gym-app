import React from 'react';
import { Form, InputFieldProps, mergeValidators } from '@gym-app/total-form';
import { isEmailValid } from './validateInput';

interface EmailFieldProps extends InputFieldProps<string> {}

export const EmailField: React.FC<EmailFieldProps> = ({ value, validators, ...props }: EmailFieldProps) => (
  <Form.Fields.TextField
    {...props}
    type="email"
    label="Email"
    name="email"
    value={value}
    validators={mergeValidators(isEmailValid, validators)}
  />
)