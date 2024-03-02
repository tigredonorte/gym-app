import React from 'react';
import { InputField, InputFieldProps } from '../FormModule/InputField';
import { isNameValid } from './validateInput';

interface NameFieldProps extends InputFieldProps<string> {}

export const NameField: React.FC<NameFieldProps> = ({...props}: NameFieldProps) => (
  <InputField
    {...props}
    type="text"
    label="Name"
    validators={isNameValid}
  />
);