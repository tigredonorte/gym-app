import React from 'react';
import { InputField, InputFieldProps, mergeValidators } from '@gym-app/total-form';
import { isNameValid } from './validateInput';

interface NameFieldProps extends InputFieldProps<string> {}

export const NameField: React.FC<NameFieldProps> = ({validators, ...props}: NameFieldProps) => (
  <InputField
    {...props}
    type="text"
    label="Name"
    validators={mergeValidators(isNameValid, validators)}
  />
);