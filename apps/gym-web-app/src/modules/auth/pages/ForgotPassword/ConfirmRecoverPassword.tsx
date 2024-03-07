import { Form, FormContainerType } from '@gym-app/total-form';
import { Box } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';

interface FormType extends FormContainerType {
  email: string;
  token: string;
}

export default class ConfirmRecoverPassword extends Component<{}> {
  confirmCode = async (formData: FormType) => {
    const data = await Form.executeRequest<FormType>({
      formData,
      errorMessage: 'Error confirming code',
      url: `${environment.backendEndpoint}/auth/confirm-recover`,
    });

    if (data.errorMessage) {
      return alert(data.errorMessage);
    }

    const { resetPasswordToken } = data;
    if (!resetPasswordToken) {
      return alert('Invalid code');
    }

    location.href = `/auth/change-password?email=${formData.email}&token=${resetPasswordToken}`;
  };

  render() {

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || '';

    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container onSave={this.confirmCode} className="auth-form box">
            <Form.Title title="Confirm Code" />
            <Form.Text text="We've sent a code to your email account" />
            <Form.Fields.TextField
              type="text"
              label="Code"
              name="token"
              validators={Form.validators.minlength(16)}
            />
            <Form.Fields.TextField type="hidden" name="email" value={email} />
            <Form.Button.Submit fullWidth title='Confirm Code' />
          </Form.Container>
        </Form.Provider>
      </Box>
    );
  }
}
