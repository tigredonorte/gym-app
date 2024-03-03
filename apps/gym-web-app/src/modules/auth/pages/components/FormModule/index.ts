import { FormContainer } from './FormContainer';
import { FormProvider } from './FormContext';
import { FormTitle } from './FormTitle';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

const FormModule = {
  Provider: FormProvider,
  Container: FormContainer,
  InputField,
  Title: FormTitle,
  Button: {
    Submit: SubmitButton
  }
};

export default FormModule;