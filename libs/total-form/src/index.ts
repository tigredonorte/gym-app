import { Fields } from './lib/Fields';
import { FormContainer } from './lib/FormContainer';
import { FormProvider } from './lib/FormContext';
import { FormError } from './lib/FormErrorException';
import { FormIcon } from './lib/FormIcon';
import { FormText } from './lib/FormText';
import { FormTitle } from './lib/FormTitle';
import { SubmitButton } from './lib/SubmitButton';
import { validators, mergeValidators } from './lib/validators';

export * from './lib/Fields/InputField';
export * from './lib/FormContainer';
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
