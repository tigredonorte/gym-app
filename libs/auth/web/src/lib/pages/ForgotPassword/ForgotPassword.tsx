import { EnvContext, postRequest } from '@gym-app/shared/web';
import { Form, FormContainerType } from '@gym-app/shared/web';
import { mdiFormTextboxPassword } from '@mdi/js';
import { Container } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { EmailField, LoginLink } from '../../components';
import '../Auth.scss';

interface ForgotPassowordState {
  navigate?: string;
  errorMessage?: string;
}
interface FormType extends FormContainerType {
  email: string;
}

export default class ForgotPassword extends React.Component<object, ForgotPassowordState> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;
  state = {
    navigate: undefined,
    errorMessage: undefined,
  };
  recoverPassword = async (formData: FormType) => {
    try {
      await postRequest<FormType>('/auth/forgot-password', formData);
      this.setState({ navigate: '/auth/confirm-recover?email=' + formData.email });
    } catch (error) {
      throw new Form.Error(error instanceof Error ? error.message : 'ForgotPassword failed', 'ForgotPassword Error');
    }
  };

  render() {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    const { navigate } = this.state;
    if (navigate) {
      return (<Navigate to={navigate} replace={true} />);
    }

    return (
      <Container component="main" maxWidth="xs" className="auth-page">
        <Form.Provider>
          <Form.Container onSave={this.recoverPassword} className="auth-form">
            <Form.Icon path={mdiFormTextboxPassword} />
            <Form.Title title="Forgot Password" />
            <Form.Text text="You will receive a code on your email in order to recover your account" />
            <EmailField name="email" initialValue={email || ''} />
            <Form.Button.Submit fullWidth title="Send me the code on my email" />
          </Form.Container>
        </Form.Provider>
        <LoginLink />
      </Container>
    );
  }
}
