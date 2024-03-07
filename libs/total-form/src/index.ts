import { FormProvider } from './lib/FormContext';
import { FormTitle } from './lib/FormTitle';
import { SubmitButton } from './lib/SubmitButton';
import { FormError } from './lib/FormErrorException';
import { FormContainer } from './lib/FormContainer';
import { InputField, mergeValidators } from './lib/InputField';
import { Fields } from './lib/Fields';

export * from './lib/InputField';
export * from './lib/FormContainer';

const TotalForm = {
  Provider: FormProvider,
  Container: FormContainer,
  Title: FormTitle,
  Button: {
    Submit: SubmitButton
  },
  Fields,
  Input: InputField,
  Error: FormError,
  mergeValidators,
};

export default TotalForm;