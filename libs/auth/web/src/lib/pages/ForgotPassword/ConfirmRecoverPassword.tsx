import { EnvContext, postRequest } from '@gym-app/shared/web';
import { Form, FormContainerType } from '@gym-app/shared/web';
import { mdiCodeTags } from '@mdi/js';
import { Container } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import '../Auth.scss';

interface FormType extends FormContainerType {
  email: string;
  token: string;
}

export default class ConfirmRecoverPassword extends React.Component< object,{ navigate?: string }> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;
  state = {
    navigate: undefined,
  };

  confirmCode = async (formData: FormType) => {
    try {
      const { resetPasswordToken } = await postRequest<FormType>('/auth/confirm-recover', formData);
      if (!resetPasswordToken) {
        throw new Form.Error('Invalid code', 'ConfirmRecoverPassword Error');
      }

      this.setState({ navigate: '/auth/change-password?email=' +formData.email +'&token=' +resetPasswordToken });
    } catch (error) {
      throw new Form.Error('Error confirming code', 'ConfirmRecoverPassword Error');
    }
  };

  render() {
    const { navigate } = this.state;
    if (navigate) {
      return <Navigate to={navigate} replace={true} />;
    }

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || '';
    const token = queryParams.get('token') || '';

    return (
      <Container component="main" maxWidth="xs" className="auth-page">
        <Form.Provider>
          <Form.Container onSave={this.confirmCode} className="auth-form">
            <Form.Icon path={mdiCodeTags} />
            <Form.Title title="Confirm Code" />
            <Form.Text text="We've sent a code to your email account" />
            <Form.Fields.TextField
              type="text"
              label="Code"
              name="token"
              initialValue={token}
              validators={Form.validators.minlength(16)}
            />
            <Form.Fields.TextField type="hidden" name="email" value={email} />
            <Form.Button.Submit fullWidth title="Confirm Code" />
          </Form.Container>
        </Form.Provider>
      </Container>
    );
  }
}
