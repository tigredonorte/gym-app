import React from 'react';
import { mergeValidators, validators } from '../validators';
import { InputFieldProps } from './InputField';

interface ConfirmFieldProps {
  children: React.ReactNode;
  confirmLabel: string;
  confirmName: string;
}

export const ConfirmField: React.FC<ConfirmFieldProps> = ({ children, confirmLabel: label, confirmName: name }) => {
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length !== 1) {
    throw new Error('ConfirmField must have exactly one child');
  }

  if (!React.isValidElement(childrenArray[0])) {
    throw new Error('ConfirmField child must be a valid React element');
  }

  const child = childrenArray[0];
  const fieldName = child.props.name;

  if (!fieldName) {
    throw new Error('Field child must have a name prop');
  }

  const cloned = React.cloneElement(child as React.ReactElement<InputFieldProps<never>>, {
    validators: mergeValidators(validators.isEqualField(fieldName), child.props.validators),
    label,
    name,
  });
  return (
    <>
      {children}
      {cloned}
    </>
  );
};
