import { EnvContext, postRequest } from '@gym-app/shared/web';
import { Form, FormContainerType } from '@gym-app/shared/web';
import { mdiOnepassword } from '@mdi/js';
import { Container } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { PasswordField } from '../../components';
import '../Auth.scss';

interface FormType extends FormContainerType {
  email: string;
}

export default class ChangePassword extends React.Component<object, { navigate?: string }> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;
  state = {
    navigate: '',
  };
  changePassword = async (formData: FormType) => {
    try {
      await postRequest<FormType>('/auth/change-password', formData);
      alert('Password changed successfully');
      this.setState({ navigate: '/auth' });
    } catch (error) {
      throw new Form.Error('Error changing password', 'ChangePassword Error');
    }
  };

  render() {
    const { navigate } = this.state;
    if (navigate) {
      return (<Navigate to={navigate} replace={true} />);
    }

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || '';
    const token = queryParams.get('token') || '';

    return (
      <Container component="main" maxWidth="xs" className="auth-page">
        <Form.Provider>
          <Form.Container onSave={this.changePassword} className="auth-form">
            <Form.Icon path={mdiOnepassword} />
            <Form.Title title="Change Password" />
            <Form.Text text="Your code has been confirmed!" />
            <Form.Fields.ConfirmField confirmLabel="Confirm Password" confirmName="confirmPassword">
              <PasswordField name="password" />
            </Form.Fields.ConfirmField>
            <Form.Fields.TextField type="hidden" name="email" value={email} />
            <Form.Fields.TextField type="hidden" name="token" value={token} />
            <Form.Button.Submit fullWidth title="Change Password" />
          </Form.Container>
        </Form.Provider>
      </Container>
    );
  }
}
