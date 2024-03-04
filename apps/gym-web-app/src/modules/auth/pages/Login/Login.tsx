import { Box } from '@mui/material';
import React from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';
import Form, { FormContainerType } from '@gym-app/total-form';
import { ForgotLink, SignupLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';
import { PasswordField } from '../components/fields/PasswordField';

interface LoginState {}

interface FormType extends FormContainerType {
  email: string;
  password: string;
}

interface IProps {}

export default class Login extends React.Component<IProps, LoginState> {
  constructor(props: IProps) {
    super(props);
  }

  handleLogin = async (formData: FormType) => {
    try {
      const response = await fetch(`${environment.backendEndpoint}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Form.Error(data.message, 'Login Error');
      }

      localStorage.setItem('userData', JSON.stringify(data));
      window.location.href = '/';
    } catch (error) {
      if (!(error instanceof Form.Error)) {
        const message = (error instanceof Error) ? error.message : (error as string);
        throw new Form.Error(message || 'Unkown login error', 'Login Error');
      }
      throw error;
    }
  };

  render() {
    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container onSave={this.handleLogin} className="auth-form box" noValidate autoComplete="off">
            <Form.Title title="Login" />
            <EmailField name='email'/>
            <PasswordField name='password'/>
            <Form.Button.Submit fullWidth title='Login' />
            <Box className='auth-links'>
              <ForgotLink includeSubTitle={false} />
            </Box>
          </Form.Container>
          <SignupLink />
        </Form.Provider>
      </Box>
    );
  }
}