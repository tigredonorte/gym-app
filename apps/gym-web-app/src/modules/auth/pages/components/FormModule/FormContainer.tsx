import { Box } from '@mui/material';
import React, { Component } from 'react';
import { InputFieldProps } from './InputField';

interface FormContainerProps<FormProps> extends React.HTMLProps<HTMLFormElement> {
  containerClassName?: string;
  children: React.ReactNode[];
  onSave: (state: FormProps) => void;
  onValidityChange?: (isFormValid: boolean) => void;
}

export type FormContainerType = Record<string, unknown>;

interface FormContainerState<FormProps> {
  formData: FormProps;
  formValidity: Record<keyof FormProps, boolean>;
  isFormValid: boolean;
}

export class FormContainer<FormProps extends FormContainerType> extends Component<FormContainerProps<FormProps>, FormContainerState<FormProps>> {

  state: Readonly<FormContainerState<FormProps>> = {
    formData: {} as FormProps,
    formValidity: {} as Record<keyof FormProps, boolean>,
    isFormValid: false,
  };

  constructor(props: FormContainerProps<FormProps>) {
    super(props);

    const { children } = props;

    // Initialize formData and formValidity with values from the children using a single reduce function
    const initialState = React.Children.toArray(children)
      .reduce((acc, child) => {
        if (!React.isValidElement(child) || typeof child.props.name !== 'string') {
          return acc;
        }

        const name = child.props.name as keyof FormProps;
        if (name in acc.formData) {
          const { initialValue } = child.props as InputFieldProps<unknown>;
          
          // Set initial form data and mark field as initially invalid
          acc.formData[name] = (initialValue ?? undefined) as FormProps[keyof FormProps];
          acc.formValidity[name] = false;
        }
        return acc;
      }, { formData: {} as FormProps, formValidity: {} as Record<keyof FormProps, boolean> });

    this.state = {
      formData: initialState.formData,
      formValidity: initialState.formValidity,
      isFormValid: false,
    };
  }

  handleFieldChange = (change: { value: unknown; name: string }) => this.setState(({formData}) => ({
    formData: {
      ...formData,
      [change.name]: change.value
    }
  }));

  handleFieldValidityChange = (name: string, isValid: boolean) => {
    const { onValidityChange } = this.props;
    this.setState(({ formValidity: validity }) => {
      const formValidity = { ...validity, [name]: isValid };
      const isFormValid = this.isFormValid(formValidity);
      onValidityChange?.(isFormValid);
      return {
        formValidity,
        isFormValid,
      }
    });
  };

  isFormValid = (formValidity: Record<keyof FormProps, boolean>) => Object.values(formValidity).every(Boolean);

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (this.state.isFormValid) {
      this.props.onSave(this.state.formData);
    }
  };

  render() {
    const { children, containerClassName, onValidityChange, onSave, ...props } = this.props;
    const { formData } = this.state;

    // Clone children to inject additional props
    const childrenWithProps = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }
      if (!child.props.name) {
        return child;
      }
      const value: any = formData[child.props.name] ?? child.props.initialValue;
  
      console.log({ name: child.props.name, value });
      // Use type assertion here
      return React.cloneElement(child as React.ReactElement<InputFieldProps<any>>, {
        value,
        onChange: this.handleFieldChange,
        onValidityChange: (isValid: boolean) => this.handleFieldValidityChange(child.props.name, isValid),
      });
    });

    return (
      <Box className={containerClassName}>
        <form onSubmit={this.handleSubmit} {...props}>
          {childrenWithProps}
        </form>
      </Box>
    );
  }
}
