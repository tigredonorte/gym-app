import React, { useEffect, useState } from 'react';
import { validators } from '../validators';
import { InputFieldProps } from './InputField';

interface ConfirmFieldProps {
  children: React.ReactNode;
  confirmLabel: string;
  confirmName: string;
}

export const ConfirmField: React.FC<ConfirmFieldProps> = React.memo(({ children, confirmLabel: label, confirmName: name }: ConfirmFieldProps) => {
  const [clonedElement, setClonedElement] = useState<React.ReactNode>(null);
  const [originalElement, setOriginalElement] = useState<React.ReactNode>(null);

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

  useEffect(() => {
    const cloned = React.cloneElement(child as React.ReactElement<InputFieldProps<never>>, {
      key: name,
      validators: validators.isEqualField(fieldName),
      label,
      name,
    });

    setOriginalElement(React.cloneElement(child as React.ReactElement<InputFieldProps<never>>, {
      onChange: (value: unknown) => {
        if (child.props.onChange) {
          child.props.onChange(value);
        }
      }
    }));
    setClonedElement(cloned);
  }, []);

  return (
    <>
      {originalElement}
      {clonedElement}
    </>
  );
});