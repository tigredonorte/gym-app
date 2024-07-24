import { ErrorAlert, PasswordField } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader } from '@gym-app/ui';
import { mdiLock } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import React, { useCallback } from 'react';
import { IUser } from '../../reducer';
import { ChangePasswordFormType } from '../../reducer/UserActions';
import { PendingChangeChange } from './PendingChangeConfirmation';


interface ChangePassworSectionProps {
  error: string;
  loading: boolean;
  user: IUser;
  onSave: (formData: ChangePasswordFormType & FormContainerType) => void;
  onCancel: () => void;
}

export const ChangePassworSection: React.FC<ChangePassworSectionProps> = React.memo(({ error, onSave, loading, user, onCancel }: ChangePassworSectionProps) => {
  const handleSave = useCallback((formData: ChangePasswordFormType & FormContainerType) => {
    onSave(formData);
  }, [onSave]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title="Change Password" subtitle="Update Profile Security" />
        <div className='loading'>
          Loading...
        </div>
      </Card>
    );
  }

  const hasPendingRequest = user.passwordHistory?.some((item) => !item.confirmed && new Date(item.expiresAt) > new Date());
  if (hasPendingRequest) {
    return (
      <PendingChangeChange
        title='Change password'
        subtitle='You have a pending password change request. Access your email to confirm the change.'
        onCancel={onCancel}
      />
    );
  }

  return (
    <Card>
      <CardHeader title="Change Password" subtitle="Update Profile Security" />
      <Form.Provider>
        <Form.Container className="general-settings-form" onSave={handleSave}>
          <Form.Fields.ConfirmField confirmLabel="Confirm Password" confirmName="confirmPassword">
            <PasswordField name="newPassword" label="New Password" />
          </Form.Fields.ConfirmField>
          <PasswordField name='oldPassword' label="Current Password"  />
          <ErrorAlert message={error} />
          <div className='button-container'>
            <Form.Button.Submit
              variant="contained"
              color="primary"
              endIcon={<Icon path={mdiLock} size={1}/>}
              fullWidth={false}
              disabled={loading}
            >
              Change Password
            </Form.Button.Submit>
          </div>
        </Form.Container>
      </Form.Provider>
    </Card>
  );
});

