import { Box } from '@mui/material';
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

  handleSignup = async (formData: FormType) => {
    try {
      console.log('Signup form data', formData);
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
      window.location.href = '/';
    } catch (error) {
      console.error('Error during fetch operation', error);
      this.setState({ errorMessage: 'Error during signup' });
    }
  };

  checkEmailExists = async (email: string): Promise<string | null> => {
    try {
      const response = await fetch(`${environment.backendEndpoint}/auth/checkEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.status === 200) {
        return "Email already exists. Do you wan't to make <a href='/auth'>Login</a>?";
      }
    } catch (error) {
      console.error('Error during fetch operation', error);
    } 

    return null;
  };

  handleCloseSnackbar = () => {
    this.setState({ errorMessage: '' });
  };

  render() {
    const { errorMessage } = this.state;

    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container className="auth-form box" onSave={this.handleSignup}>
            {errorMessage && <ErrorAlert message={errorMessage} onClose={this.handleCloseSnackbar} />}
            <Form.Title title="Signup" />
            <NameField name='name'/>
            <EmailField name='email' blurValidators={this.checkEmailExists}/>
            <PasswordField name='password'/>
            <Form.Button.Submit fullWidth title='Signup' />
          </Form.Container>
        </Form.Provider>
        <LoginLink />
      </Box>
    );
  }
}
