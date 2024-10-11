import { Form, InputFieldProps, mergeValidators } from '@gym-app/shared/web';
import React from 'react';
import { isEmailValid } from './validateInput';

type EmailFieldProps = InputFieldProps<string>

export const EmailField: React.FC<EmailFieldProps> = React.memo(({ value, validators, ...props }: EmailFieldProps) => (
  <Form.Fields.TextField
    {...props}
    type="email"
    label="Email"
    name="email"
    value={value}
    validators={mergeValidators(isEmailValid, validators)}
  />
));