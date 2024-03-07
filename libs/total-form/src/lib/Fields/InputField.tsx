import { FormControl, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { FormContext } from '../FormContext';
import { ValidatorFunction, ValidatorType, mergeValidators } from '../validators';

type InputElements = HTMLInputElement | HTMLTextAreaElement;

export type ChangeValue<T> = { value: T, name: string };
type ChangeFunction<T> = (change: ChangeValue<T>) => void;


export interface InputFieldProps<T> extends Omit<TextFieldProps, 'onChange' | 'onBlur' | 'ref'> {
  name: string;
  ref?: React.Ref<never>;
  onChange?: ChangeFunction<T>;
  onBlur?: (event: React.FocusEvent<InputElements>) => void;
  validators?: ValidatorType<T>;
  blurValidators?: ValidatorType<T>;
  value?: T;
  initialValue?: T;
}

export interface foo {
  bar: string;
}

interface InputFieldState {
  touched: boolean;
  error: string | null;
}

export class InputField<T> extends React.Component<InputFieldProps<T>, InputFieldState> {
  static contextType = FormContext;
  declare context: React.ContextType<typeof FormContext>;
  constructor(props: InputFieldProps<T>) {
    super(props);
    this.state = {
      touched: false,
      error: null
    };
  }

  componentDidMount() {
    const { name, value, initialValue } = this.props;
    const currentValue = value || initialValue || '';
    this.context.updateFormData(name, currentValue);
    this.validate(currentValue as never, this.getValidators());
  }

  getValidators = (isBlur = false) => {
    const { validators, blurValidators } = this.props;
    const current = isBlur ? mergeValidators(blurValidators, validators) : validators;
    if (!current) return [];
    return Array.isArray(current) ? current : [current];
  }

  validate = async(value: T, validatorArray: ValidatorFunction<T>[]) => {
    const { validators, name } = this.props;
    if (!validators) return null;

    const { formData } = this.context;

    let error: string | null = null;
    for (let validator of validatorArray) {
      const err = await validator?.(value, formData);
      if (err) {
        error = err;
        break;
      }
    }
    this.context.updateFieldValidity(name, error === null);
    this.setState({ error });
  };

  handleChange = (event: React.ChangeEvent<InputElements>, validators = this.getValidators()) => {
    const { value, name } = event.target as InputElements;
    const { onChange } = this.props;
    this.validate(value as T, validators);
    this.context.updateFormData(name, value);
    onChange?.({ value, name } as { value: T, name: string });
  };

  handleBlur = (event: React.FocusEvent<InputElements>) => {
    const { onBlur } = this.props;
    this.setState({ touched: true });
    this.handleChange(event as unknown as React.ChangeEvent<InputElements>, this.getValidators(true));
    onBlur?.(event);
  };

  render() {
    const { touched, error } = this.state;
    const { validators, blurValidators, ...inputProps } = this.props;

    const isHidden = inputProps.type === 'hidden';
    const style = isHidden ? { display: 'none' } : {};
    return (
      <FormControl variant="outlined" fullWidth margin="normal" style={style}>
        <TextField
          {...inputProps}
          error={!!(error) && touched}
          helperText={(touched && !!error && (<span dangerouslySetInnerHTML={{ __html: error }} />)) || ''}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </FormControl>
    );
  }
}
