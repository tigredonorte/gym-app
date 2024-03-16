import { Form, FormContainerType } from '@gym-app/total-form';
import { Box } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';

interface FormType extends FormContainerType {
  email: string;
  token: string;
}

export default class ConfirmRecoverPassword extends React.Component< object,{ navigate?: string }> {
  state = {
    navigate: undefined,
  };

  confirmCode = async (formData: FormType) => {
    const data = await Form.executeRequest<FormType>({
      formData,
      errorMessage: 'Error confirming code',
      url: `${environment.backendEndpoint}/auth/confirm-recover`,
    });

    if (data.errorMessage) {
      throw new Form.Error(data.errorMessage, 'ConfirmRecoverPassword Error');
    }

    const { resetPasswordToken } = data;
    if (!resetPasswordToken) {
      throw new Form.Error('Invalid code', 'ConfirmRecoverPassword Error');
    }

    this.setState({ navigate: '/auth/change-password?email=' +formData.email +'&token=' +resetPasswordToken });
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
      <Box className="auth-page">
        <Form.Provider>
          <Form.Container onSave={this.confirmCode} className="auth-form box">
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
      </Box>
    );
  }
}
