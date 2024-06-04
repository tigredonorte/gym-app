import { Box, BoxProps, CssBaseline } from '@mui/material';
import React, { Component } from 'react';
import { FormContext } from './FormContext';
import { FormError } from './FormErrorException';
import FormErrorSnackbar from './FormErrorSnackbar';

interface FormContainerProps<FormProps> extends React.HTMLProps<HTMLFormElement> {
  containerClassName?: string;
  boxProps?: BoxProps;
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
    } finally {
      setRequesting(false);
    }
  };

  render() {
    const { children, containerClassName, onValidityChange, onSave, boxProps, ...props } = this.props;

    return (
      <Box className={containerClassName} {...boxProps}>
        <CssBaseline />
        <FormErrorSnackbar />
        <form onSubmit={this.handleSubmit} {...props}>
          {children}
        </form>
      </Box>
    );
  }
}
