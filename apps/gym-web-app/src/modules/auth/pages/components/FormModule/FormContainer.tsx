import { Button, Container } from '@mui/material';
import React, { Component } from 'react';
import { InputFieldProps } from './InputField';

interface FormContainerProps<FormProps> {
  children: React.ReactNode[];
  onSubmit: (state: FormProps) => void;
  onValidityChange?: (isFormValid: boolean) => void;
}

interface FormContainerState<FormProps> {
  formData: FormProps;
  formValidity: Record<keyof FormProps, boolean>;
}

export class FormContainer<FormProps extends Record<string, unknown>> extends Component<FormContainerProps<FormProps>, FormContainerState<FormProps>> {

  state: Readonly<FormContainerState<FormProps>> = {
    formData: {} as FormProps,
    formValidity: {} as Record<keyof FormProps, boolean>
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
      formValidity: initialState.formValidity
    };
  }

  handleFieldChange = (change: { value: unknown; name: string }) => {
    console.log('change', change);
    this.setState(({formData}) => ({
      formData: {
        ...formData,
        [change.name]: change.value
      }
    }));
  };

  handleFieldValidityChange = (name: string, isValid: boolean) => {
    this.setState(({formValidity}) => ({
      formValidity: { ...formValidity, [name]: isValid }
    }));
    const { onValidityChange } = this.props;
    onValidityChange?.(this.isFormValid());
  };

  isFormValid = () => {
    const { formValidity } = this.state;
    return Object.values(formValidity).every(Boolean);
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.props.onSubmit(this.state.formData);
    }
  };

  render() {
    const { children } = this.props;
    const { formData } = this.state;

    // Clone children to inject additional props
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.props.name) {
        const value: any = formData[child.props.name] ?? child.props.initialValue;
        console.log({ value, name: child.props.name });
    
        // Use type assertion here
        return React.cloneElement(child as React.ReactElement<InputFieldProps<any>>, {
          value,
          onChange: this.handleFieldChange,
          onValidityChange: (isValid: boolean) => this.handleFieldValidityChange(child.props.name, isValid),
        });
      }
      return child;
    });

    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          {childrenWithProps}
        </form>
      </Container>
    );
  }
}
