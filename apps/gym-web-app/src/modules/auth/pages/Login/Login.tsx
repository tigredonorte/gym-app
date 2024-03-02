import { Box, Button } from '@mui/material';
import React from 'react';
import '../Auth.scss';
import Form from '../components/FormModule';
import { FormContainerType } from '../components/FormModule/FormContainer';
import { FormProvider } from '../components/FormModule/FormContext';
import { ForgotLink, SignupLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';
import { PasswordField } from '../components/fields/PasswordField';

interface LoginState {
  email: string;
  password: string;
  isFormValid: boolean;
}

interface FormType extends FormContainerType {
  email: string;
  password: string;
}

interface IProps {}

export default class Login extends React.Component<IProps, LoginState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isFormValid: false,
    };
  }

  handleInputChange = ({ name, value }: { name: string, value: unknown }) => {
    const updatedValue: Partial<LoginState> = { [name]: value };
    this.setState(updatedValue as LoginState);
  };

  handleValidityChange = (field: string, isValid: boolean) => {
    this.setState({ isFormValid: isValid });
  }

  handleSubmit = (data: FormType) => {
    console.log(data);
  };

  render() {
    const { email, password, isFormValid } = this.state;

    return (
      <Box className='auth-page'>
        <FormProvider>
          <Form.Container onSave={this.handleSubmit} className="auth-form box" noValidate autoComplete="off">
            <Form.Title title="Login" />
            <EmailField name='email' value={email} onChange={this.handleInputChange}/>
            <PasswordField name='password' value={password} onChange={this.handleInputChange} />
            <Form.Button.Submit fullWidth title='Login' />
            <Box className='auth-links'>
              <ForgotLink includeSubTitle={false} />
            </Box>
          </Form.Container>
          <SignupLink />
        </FormProvider>
      </Box>
    );
  }
}