import { Box, Button } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';
import { ErrorAlert } from '../components/ErrorAlert';
import Form from '../components/FormModule';
import { FormContainerType } from '../components/FormModule/FormContainer';
import { LoginLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';

interface ForgotPasswordState {
  isFormValid: boolean;
  errorMessage: string;
}

interface FormType extends FormContainerType {
  email: string;
}

export default class ForgotPassword extends Component<{}, ForgotPasswordState> {
  state = {
    isFormValid: false,
    errorMessage: '',
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
    const { errorMessage, isFormValid } = this.state;
    console.log(errorMessage);

    return (
      <Box className='auth-page'>
        <Form.Container onSave={(data) => console.log(data)} className="auth-form box">
          {errorMessage && <ErrorAlert message={errorMessage} onClose={this.handleCloseSnackbar} />}
          <Form.Title title="Forgot Password" />
          <EmailField name='email'/>
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid} fullWidth>
            Forgot Password
          </Button>
        </Form.Container>

        <LoginLink />
      </Box>
    );
  }
}
