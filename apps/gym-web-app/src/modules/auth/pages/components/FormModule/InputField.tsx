import React from 'react';
import { FormControl, TextField, TextFieldProps } from '@mui/material';

type ValidatorFunction<T> = (value: T) => string | null;

type InputElements = HTMLInputElement | HTMLTextAreaElement;

export type ChangeValue<T> = { value: T, name: string };
type ChangeFunction<T> = (change: ChangeValue<T>) => void;

export interface InputFieldProps<T> extends Omit<TextFieldProps, 'onChange' | 'onBlur' | 'ref'> {
  name: string;
  ref?: React.Ref<never>;
  onChange?: ChangeFunction<T>;
  onBlur?: (event: React.FocusEvent<InputElements>) => void;
  onValidityChange?: (isValid: boolean, name: string) => void;
  validators?: ValidatorFunction<T> | ValidatorFunction<T>[];
  value?: T;
  initialValue?: T;
}

interface InputFieldState {
  touched: boolean;
  error: string | null;
}

export class InputField<T> extends React.Component<InputFieldProps<T>, InputFieldState> {
  constructor(props: InputFieldProps<T>) {
    super(props);
    this.state = {
      touched: false,
      error: null
    };
  }

  validateAndNotify = (value: T, name: string) => {
    const error = this.validate(value);
    this.setState({ error });

    // Notify the parent about validity change
    if (this.props.onValidityChange) {
      console.log('onValidityChange', error === null, name);
      this.props.onValidityChange(error === null, name);
    }
  }

  validate = (value: T) => {
    const { validators } = this.props;
    if (!validators) return null;

    const validatorArray = Array.isArray(validators) ? validators : [validators];
    for (let validator of validatorArray) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };

  handleChange = (event: React.ChangeEvent<InputElements>) => {
    const { value, name } = event.target as InputElements;
    const { onChange } = this.props;
    this.validateAndNotify(value as T, name);
    onChange?.({ value, name } as { value: T, name: string });
  };

  handleBlur = (event: React.FocusEvent<InputElements>) => {
    this.setState({ touched: true });
    this.handleChange(event as unknown as React.ChangeEvent<InputElements>);
    if (this.props.onBlur) this.props.onBlur(event);
  };

  render() {
    const { touched, error } = this.state;
    const { validators, onValidityChange, ...inputProps } = this.props;

    return (
      <FormControl variant="outlined" fullWidth margin="normal">
        <TextField
          {...inputProps}
          error={!!(error) && touched}
          helperText={(touched && (error)) || ''}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </FormControl>
    );
  }
}
