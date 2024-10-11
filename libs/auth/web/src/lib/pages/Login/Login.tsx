import { Form, FormContainerType } from '@gym-app/shared/web';
import { AuthContext } from '@gym-app/user/web';
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
  static contextType = AuthContext;
  declare context: React.ContextType<typeof AuthContext>;
  state = {
    email: '',
    navigate: '',
  };

  handleLogin = async (formData: FormType) => {
    try {
      await this.context?.login?.(formData);
      this.setState({ navigate: '/' });
    } catch (error) {
      throw new Form.Error(error instanceof Error ? error.message : 'Unkown login error', 'Login Error');
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