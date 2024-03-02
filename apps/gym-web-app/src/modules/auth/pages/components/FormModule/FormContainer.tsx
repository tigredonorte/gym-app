import { Box } from '@mui/material';
import React, { Component } from 'react';
import { FormContext, FormContextType, FormProvider } from './FormContext';
import { Snackbar, Alert } from '@mui/material';
import { FormError } from './FormError';
import FormErrorSnackbar from './FormErrorSnackbar';

interface FormContainerProps<FormProps> extends React.HTMLProps<HTMLFormElement> {
  containerClassName?: string;
  children: React.ReactNode[];
  onSave: (state: FormProps) => void;
  onValidityChange?: (isFormValid: boolean) => void;
}

export type FormContainerType = Record<string, unknown>;

export class FormContainer<FormProps extends FormContainerType> extends Component<FormContainerProps<FormProps>> {
  static contextType = FormContext;
  declare context: React.ContextType<typeof FormContext>;

  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { formData, isFormValid, fieldValidity, setRequesting, clearError, setError} = this.context;
    if (!isFormValid) {
      console.warn('invalid form data', {
        fieldValidity, isFormValid, formData,
      });
      return;
    }
    setRequesting(true);
    try {
      await this.props.onSave(formData);
      clearError();
    } catch (error) {
      if (error instanceof FormError) {
        setError({ message: error.message, title: error.title });
        return;
      }
      console.error('Error during fetch operation', error);
    }
    setRequesting(false);
  };

  render() {
    const { children, containerClassName, onValidityChange, onSave, ...props } = this.props;

    return (
      <Box className={containerClassName}>
        <FormErrorSnackbar />
        <form onSubmit={this.handleSubmit} {...props}>
          {children}
        </form>
      </Box>
    );
  }
}
