import { Form, FormContainerType } from '@gym-app/total-form';
import { Box } from '@mui/material';
import { Component } from 'react';
import { environment } from '../../../../environments/environment';
import '../Auth.scss';
import { PasswordField } from '../components/fields/PasswordField';
import { Navigate } from 'react-router-dom';

interface FormType extends FormContainerType {
  email: string;
}

export default class ChangePassword extends Component<{}, { navigate: string }> {
  changePassword = async (formData: FormType) => {
    const data = await Form.executeRequest<FormType>({
      formData,
      errorMessage: 'Error changing password',
      url: `${environment.backendEndpoint}/auth/change-password`,
    });

    if (data.errorMessage) {
      return alert(data.errorMessage);
    }
    alert('Password changed successfully');
    this.setState({ navigate: '/auth' });
  };

  render() {
    const { navigate } = this.state;
    if (navigate) {
      return (<Navigate to={navigate} replace={true}/>);
    }

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email') || '';
    const token = queryParams.get('token') || '';

    return (
      <Box className='auth-page'>
        <Form.Provider>
          <Form.Container onSave={this.changePassword} className="auth-form box">
            <Form.Title title="Change Password" />
            <Form.Text text="Your code has been confirmed!" />
            <Form.Fields.ConfirmField confirmLabel="Confirm Password" confirmName='confirmPassword'>
              <PasswordField name='password' />
            </Form.Fields.ConfirmField>
            <Form.Fields.TextField type="hidden" name="email" value={email} />
            <Form.Fields.TextField type="hidden" name="token" value={token} />
            <Form.Button.Submit fullWidth title='Change Password' />
          </Form.Container>
        </Form.Provider>
      </Box>
    );
  }
}
