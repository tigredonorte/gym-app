import { EnvContext, postRequest } from '@gym-app/shared/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { mdiAccountPlus } from '@mdi/js';
import { Container } from '@mui/material';
import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { EmailField, ErrorAlert, LoginLink, NameField, PasswordField } from '../../components';
import '../Auth.scss';

interface SignupState {
  isFormValid: boolean;
  errorMessage: string;
  navigate: string;
}

interface FormType extends FormContainerType {
  name: string;
  email: string;
  password: string;
}

export default class Signup extends Component<object, SignupState> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;
  state = {
    isFormValid: false,
    errorMessage: '',
    navigate: '',
  };
  handleInputChange = ({ name, value }: { name: string, value: unknown }) => {
    const updatedValue: Partial<SignupState> = { [name]: value };
    this.setState(updatedValue as SignupState);
  };

  handleSignup = async (formData: FormType) => {
    try {
      const { token, ...userData } = await postRequest<{ token: string, email: string, name: string }>('/auth/signup', formData);
      localStorage.setItem('token', JSON.stringify(token));
      localStorage.setItem('userData', JSON.stringify(userData));
      this.setState({ navigate: '/' });
    } catch (error) {
      console.error('Error during fetch operation', error);
      this.setState({ errorMessage: 'Error during signup' });
    }
  };

  checkEmailExists = async (email: string): Promise<string | null> => {
    try {
      const response = await fetch(`${this.context.backendEndpoint}/auth/checkEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.status !== 200) {
        return 'Email already exists. Do you wan\'t to <a href=\'/auth\'>Login</a>?';
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
    const { errorMessage, navigate } = this.state;
    if (navigate) {
      return (<Navigate to={navigate} replace={true}/>);
    }

    return (
      <Container component="main" maxWidth="xs" className="auth-page">
        <Form.Provider>
          <Form.Container className="auth-form" onSave={this.handleSignup}>
            <Form.Icon path={mdiAccountPlus} />
            {errorMessage && <ErrorAlert message={errorMessage} onClose={this.handleCloseSnackbar} />}
            <Form.Title title="Signup" />
            <NameField name='name'/>
            <EmailField name='email' blurValidators={this.checkEmailExists}/>
            <PasswordField name='password'/>
            <Form.Button.Submit fullWidth title='Signup' />
          </Form.Container>
        </Form.Provider>
        <LoginLink />
      </Container>
    );
  }
}
