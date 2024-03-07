import { Fields } from './lib/Fields';
import { FormContainer } from './lib/FormContainer';
import { FormProvider } from './lib/FormContext';
import { FormError } from './lib/FormErrorException';
import { FormText } from './lib/FormText';
import { FormTitle } from './lib/FormTitle';
import { SubmitButton } from './lib/SubmitButton';
import { executeRequest } from './lib/executeRequest';
import { validators, mergeValidators } from './lib/validators';

export * from './lib/Fields/InputField';
export * from './lib/FormContainer';
export {
  mergeValidators,
}

export const Form = {
  Provider: FormProvider,
  Container: FormContainer,
  Title: FormTitle,
  Text: FormText,
  Button: {
    Submit: SubmitButton
  },
  Fields,
  Error: FormError,
  validators,
  executeRequest,
};
