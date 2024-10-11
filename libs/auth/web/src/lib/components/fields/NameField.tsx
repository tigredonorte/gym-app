import { InputField, InputFieldProps, mergeValidators } from '@gym-app/shared/web';
import React from 'react';
import { isNameValid } from './validateInput';

type NameFieldProps = InputFieldProps<string>

export const NameField: React.FC<NameFieldProps> = React.memo(({ validators, ...props }: NameFieldProps) =>(
  <InputField
    {...props}
    type="text"
    label="Name"
    validators={mergeValidators(isNameValid, validators)}
  />
));