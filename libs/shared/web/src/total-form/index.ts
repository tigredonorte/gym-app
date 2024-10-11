import { Fields } from './Fields';
import { FormContainer } from './FormContainer';
import { FormProvider } from './FormContext';
import { FormError } from './FormErrorException';
import { FormIcon } from './FormIcon';
import { FormText } from './FormText';
import { FormTitle } from './FormTitle';
import { SubmitButton } from './SubmitButton';
import { validators, mergeValidators } from './validators';

export * from './Fields/InputField';
export * from './FormContainer';
export {
  mergeValidators,
};

export const Form = {
  Provider: FormProvider,
  Container: FormContainer,
  Title: FormTitle,
  Icon: FormIcon,
  Text: FormText,
  Button: {
    Submit: SubmitButton
  },
  Fields,
  Error: FormError,
  validators,
};
