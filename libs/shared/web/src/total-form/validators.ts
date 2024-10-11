import { FormContainerType } from './FormContainer';

const isEqualField = <T>(field: string) => (value: T, formData: FormContainerType) => {
  const otherValue = formData?.[field];
  return otherValue !== value ? 'Fields do not match' : null;
};
export const validators = {
  minlength: (min: number) => (value: string) => value?.length < min ? `Must be at least ${min} characters` : null,
  maxlength: (max: number) => (value: string) => value?.length > max ? `Must be less than ${max} characters` : null,
  exactlength: (length: number) => (value: string) => value?.length !== length ? `Must be exactly ${length} characters` : null,
  required: (value: string | number) => (!value && value !== 0) ? 'Required' : null,
  isNumber: (value: string | number) => isNaN(Number(value)) ? 'Must be a number' : null,
  isDate: (value: string) => isNaN(Date.parse(value)) ? 'Invalid date' : null,
  isPositive: (value: number) => Number(value) < 0 ? 'Must be positive' : null,
  isNonNegative: (value: number) => Number(value) < 0 ? 'Must be non-negative' : null,
  isInteger: (value: number) => !Number.isInteger(Number(value)) ? 'Must be an integer' : null,
  isNonZero: (value: number) => Number(value) === 0 ? 'Must be non-zero' : null,
  isEqualField,
};

export type ValidatorFunction<T> = (value: T, formData: FormContainerType) => Promise<string | null> | string | null;
export type ValidatorType<T> = ValidatorFunction<T> | ValidatorFunction<T>[] | undefined;

export function mergeValidators<T>(...validators: ValidatorType<T>[]): ValidatorFunction<T>[] {
  return validators.flat().filter((validator) => validator !== null) as ValidatorFunction<T>[];
}