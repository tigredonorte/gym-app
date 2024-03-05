import { Box, Button } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';
import { ErrorAlert } from '../components/ErrorAlert';
import Form, { FormContainerType } from '@gym-app/total-form';
import { LoginLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';

interface ForgotPasswordState {
}

interface FormType extends FormContainerType {
  email: string;
}

export default class ForgotPassword extends Component<{}, ForgotPasswordState> {
  state = {
  };
  handleSubmit = async (formData: FormType) => {
    try {
      const response = await fetch(`${environment.backendEndpoint}/auth/ForgotPassword`, {
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

      localStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error during fetch operation', error);
      this.setState({ errorMessage: 'Error during ForgotPassword' });
    }
  };

  handleCloseSnackbar = () => {
    this.setState({ errorMessage: '' });
  };

  render() {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');

    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container onSave={(data) => console.log(data)} className="auth-form box">
            <Form.Title title="Forgot Password" />
            <EmailField name='email' value={email || ''} />
            <Form.Button.Submit fullWidth title='Forgot Password' />
          </Form.Container>
        </Form.Provider>
        <LoginLink />
      </Box>
    );
  }
}
