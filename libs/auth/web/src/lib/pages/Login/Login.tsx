import { EnvContext } from '@gym-app/shared/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { Box } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import '../Auth.scss';
import { ForgotLink, SignupLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';
import { PasswordField } from '../components/fields/PasswordField';

interface LoginState {
  email: string;
  navigate: string;
}

interface FormType extends FormContainerType {
  email: string;
  password: string;
}

export default class Login extends React.Component<object, LoginState> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;
  state = {
    email: '',
    navigate: '',
  };

  handleLogin = async (formData: FormType) => {
    try {
      const response = await fetch(`${this.context.backendEndpoint}/auth/login`, {
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

      this.setState({ navigate: '/' });
  
    } catch (error) {
      if (!(error instanceof Form.Error)) {
        const message = (error instanceof Error) ? error.message : (error as string);
        throw new Form.Error(message || 'Unkown login error', 'Login Error');
      }
      throw error;
    }
  };

  render() {

    const { navigate } = this.state;
    if (navigate) {
      return (<Navigate to={navigate} replace={true}/>);
    }

    const { email } = this.state;
    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container onSave={this.handleLogin} className="auth-form box" noValidate autoComplete="off">
            <Form.Title title="Login" />
            <EmailField name='email' onChange={(ev) => this.setState({ email: ev.value })}/>
            <PasswordField name='password'/>
            <Form.Button.Submit fullWidth title='Login' />
            <Box className='auth-links'>
              <ForgotLink includeSubTitle={false} email={email} />
            </Box>
          </Form.Container>
          <SignupLink />
        </Form.Provider>
      </Box>
    );
  }
}