import { InputField, InputFieldProps } from '../FormModule/InputField';
import { isNameValid } from './validateInput';

interface NameFieldProps extends InputFieldProps<string> {}

export const NameField = ({ ...props }: NameFieldProps) => (
  <InputField
    {...props}
    type="text"
    label="Name"
    name="name"
    validators={isNameValid}
  />
);