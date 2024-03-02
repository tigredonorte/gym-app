import { FormContainer } from './FormContainer';
import { FormTitle } from './FormTitle';
import { InputField } from './InputField';
import { SubmitButton } from './SubmitButton';

const FormModule = {
  Container: FormContainer,
  InputField,
  Title: FormTitle,
  Button: {
    Submit: SubmitButton
  }
};

export default FormModule;