import { Form, FormContainerType } from '@gym-app/total-form';
import { Box } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';
import { LoginLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';

interface FormType extends FormContainerType {
  email: string;
}

export default class ForgotPassword extends Component<{}> {
  recoverPassword = async (formData: FormType) => {
    try {
      const response = await fetch(`${environment.backendEndpoint}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return this.setState({ errorMessage: data.message || 'ForgotPassword failed' });
      }

      location.href = `/auth/confirm-recover?email=${formData.email}`;
    } catch (error) {
      console.error('Error during fetch operation', error);
      this.setState({ errorMessage: 'Error during ForgotPassword' });
    }
  };

  render() {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container onSave={this.recoverPassword} className="auth-form box">
            <Form.Title title="Forgot Password" />
            <Form.Text text="You will receive a code on your email in order to recover your account" />
            <EmailField name='email' defaultValue={email || ''} />
            <Form.Button.Submit fullWidth title='Send me the code on my email' />
          </Form.Container>
        </Form.Provider>
        <LoginLink />
      </Box>
    );
  }
}
