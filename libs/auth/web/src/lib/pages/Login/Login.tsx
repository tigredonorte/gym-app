import { EnvContext } from '@gym-app/shared/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { mdiLogin } from '@mdi/js';
import { Container, Grid } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { EmailField, ForgotLink, PasswordField, SignupLink } from '../../components';
import '../Auth.scss';

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
      <Container component="main" maxWidth="xs" className="auth-page">
        <Form.Provider>
          <Form.Container onSave={this.handleLogin} className="auth-form" noValidate autoComplete="off" boxProps={{ sx: { mt: 1 } }}>
            <Form.Icon path={mdiLogin} />
            <Form.Title title="Login" />
            <EmailField name='email' onChange={(ev) => this.setState({ email: ev.value })}/>
            <PasswordField name='password' />

            <Form.Button.Submit fullWidth title='Login' />
            <Grid container>
              <Grid item xs>
                <ForgotLink includeSubTitle={false} email={email} />
              </Grid>
              <Grid item>
                <SignupLink includeSubTitle={false} /> 
              </Grid>
            </Grid>
          </Form.Container>
        </Form.Provider>
      </Container>
    );
  }
}