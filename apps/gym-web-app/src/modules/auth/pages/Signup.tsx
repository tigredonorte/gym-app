import { Button } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../environments/environment';
import { ErrorAlert } from './components/ErrorAlert';
import Form from './components/FormModule';
import { EmailField } from './components/fields/EmailField';
import { NameField } from './components/fields/NameField';
import { PasswordField } from './components/fields/PasswordField';

interface SignupState {
  isFormValid: boolean;
  errorMessage: string;
}

interface FormType {
  name: string;
  email: string;
  password: string;
}

export default class Signup extends Component<{}, SignupState> {
  state = {
    isFormValid: false,
    errorMessage: '',
  };
  handleSubmit = async (temp: any) => {
    try {
      const { name, email, password } = temp as unknown as FormType;
      const response = await fetch(`${environment.backendEndpoint}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
    console.log(errorMessage);

    return (
      <Form.Container onSubmit={(data) => console.log(data)}>
        {errorMessage && <ErrorAlert message={errorMessage} onClose={this.handleCloseSnackbar} />}
        <Form.Title title="Signup" />
        <NameField />
        <EmailField />
        <PasswordField />
        <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
          Signup
        </Button>
      </Form.Container>
    );
  }
}
