import { Button, Container, Link } from '@mui/material';
import React from 'react';
import { EmailField } from './components/fields/EmailField';
import { PasswordField } from './components/fields/PasswordField';

interface LoginState {
  email: string;
  password: string;
  isFormValid: boolean;
}

interface IProps {}

export default class Login extends React.Component<IProps, LoginState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isFormValid: false,
    };
  }

  handleInputChange = ({ name, value }: { name: string, value: unknown }) => {
    const updatedValue: Partial<LoginState> = { [name]: value };
    this.setState(updatedValue as LoginState);
  };

  handleValidityChange = (field: string, isValid: boolean) => {
    this.setState({ isFormValid: isValid });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the login logic here
    console.log(this.state);
  };

  render() {
    const { email, password, isFormValid } = this.state;

    return (
      <Container>
        <form onSubmit={this.handleSubmit} noValidate autoComplete="off">
          <EmailField value={email} onChange={this.handleInputChange} onValidityChange={(isValid)=> this.handleValidityChange('email', isValid)}/>
          <PasswordField value={password} onChange={this.handleInputChange} />
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
            Signup
          </Button>
          <div style={{ marginTop: '10px' }}>
            <Link href="/auth/forgot" variant="body2">
              Forgot Password?
            </Link>
            {' | '}
            <Link href="/auth/signup" variant="body2">
              Signup
            </Link>
          </div>
        </form>
      </Container>
      
    );
  }
}