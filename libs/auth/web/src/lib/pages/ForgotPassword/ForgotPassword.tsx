import { Form, FormContainerType } from '@gym-app/total-form';
import { Box } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import '../Auth.scss';
import { LoginLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';
import { EnvContext } from '@gym-app/shared/web';

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
      const response = await fetch(`${this.context.backendEndpoint}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Form.Error(data.message || 'ForgotPassword failed', 'ForgotPassword Error');
      }

      this.setState({ navigate: '/auth/confirm-recover?email=' + formData.email });
    } catch (error) {
      if (error instanceof Form.Error) {
        throw error;
      }
      throw new Form.Error('Error during fetch operation', 'ForgotPassword Error');
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
      <Box className="auth-page">
        <Form.Provider>
          <Form.Container onSave={this.recoverPassword} className="auth-form box">
            <Form.Title title="Forgot Password" />
            <Form.Text text="You will receive a code on your email in order to recover your account" />
            <EmailField name="email" initialValue={email || ''} />
            <Form.Button.Submit fullWidth title="Send me the code on my email" />
          </Form.Container>
        </Form.Provider>
        <LoginLink />
      </Box>
    );
  }
}
