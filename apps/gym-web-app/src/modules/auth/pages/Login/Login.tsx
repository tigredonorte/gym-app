import { Box, Button } from '@mui/material';
import React from 'react';
import '../Auth.scss';
import Form from '../components/FormModule';
import { ForgotLink, SignupLink } from '../components/Links';
import { EmailField } from '../components/fields/EmailField';
import { PasswordField } from '../components/fields/PasswordField';
import { FormContainerType } from '../components/FormModule/FormContainer';

interface LoginState {
  email: string;
  password: string;
  isFormValid: boolean;
}

interface FormType extends FormContainerType {
  email: string;
  password: string;
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

  handleSubmit = (data: FormType) => {
    console.log(data);
  };

  render() {
    const { email, password, isFormValid } = this.state;

    return (
      <Box className='auth-page'>
        <Form.Container onSave={this.handleSubmit} className="auth-form box" noValidate autoComplete="off">
          <EmailField name='email' value={email} onChange={this.handleInputChange} onValidityChange={(isValid)=> this.handleValidityChange('email', isValid)}/>
          <PasswordField name='password' value={password} onChange={this.handleInputChange} />
          <Button type="submit" variant="contained" color="primary" disabled={!isFormValid} fullWidth>
            Login
          </Button>
          <Box className='auth-links'>
            <ForgotLink includeSubTitle={false} />
          </Box>
        </Form.Container>
        
        <SignupLink />
      </Box>
    );
  }
}