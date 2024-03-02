import { Box, Button } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';
import { ErrorAlert } from '../components/ErrorAlert';
import Form from '../components/FormModule';
import { FormContainerType } from '../components/FormModule/FormContainer';
import { LoginLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';
import { NameField } from '../components/fields/NameField';
import { PasswordField } from '../components/fields/PasswordField';

interface SignupState {
  isFormValid: boolean;
  errorMessage: string;
}

interface FormType extends FormContainerType {
  name: string;
  email: string;
  password: string;
}

export default class Signup extends Component<{}, SignupState> {
  state = {
    isFormValid: false,
    errorMessage: '',
  };
  handleInputChange = ({ name, value }: { name: string, value: unknown }) => {
    const updatedValue: Partial<SignupState> = { [name]: value };
    this.setState(updatedValue as SignupState);
  };

  handleValidityChange = (isFormValid: boolean) => {
    console.log(isFormValid);
    this.setState({ isFormValid });
  }

  handleSubmit = async (formData: FormType) => {
    try {
      const response = await fetch(`${environment.backendEndpoint}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return this.setState({ errorMessage: data.message || 'Signup failed' });
      }

      localStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error during fetch operation', error);
      this.setState({ errorMessage: 'Error during signup' });
    }
  };

  handleCloseSnackbar = () => {
    this.setState({ errorMessage: '' });
  };

  render() {
    const { errorMessage, isFormValid } = this.state;
    console.log({ errorMessage, isFormValid });

    return (
      <Box className='auth-page'>
        <Form.Container className="auth-form box" onSave={this.handleSubmit} onValidityChange={this.handleValidityChange}>
          {errorMessage && <ErrorAlert message={errorMessage} onClose={this.handleCloseSnackbar} />}
          <Form.Title title="Signup" />
          <NameField name='name'/>
          <EmailField name='email'/>
          <PasswordField name='password'/>
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid} fullWidth>
            Signup
          </Button>
        </Form.Container>

        <LoginLink />
      </Box>
    );
  }
}
