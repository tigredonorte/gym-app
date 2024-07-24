import { EmailField, ErrorAlert } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader } from '@gym-app/ui';
import { mdiContentSaveOutline, mdiDeleteOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import React from 'react';
import { IUser } from '../../reducer';
import { ChangeEmailSettingFormType } from '../../reducer/UserActions';
import './Account.scss';

const ChangeEmailContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Card>
      <CardHeader title="Change Email" />
      {children}
    </Card>
  );
};
interface PendingEmailChangeProps {
  onCancel: () => void;
}
export const PendingEmailChange: React.FC<PendingEmailChangeProps> = ({ onCancel }: PendingEmailChangeProps) => {
  return (
    <ChangeEmailContainer>
      <p>
        You have a pending email change request. Access your email to confirm the change.
      </p>
      <Button
        type="submit"
        color="primary"
        variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => onCancel()}
      >
        Cancel Change
        <Box sx={{ marginLeft: 1, display: 'flex' }}>
          <Icon path={mdiDeleteOutline} size={1}/>
        </Box>
      </Button>
    </ChangeEmailContainer>
  );
};


interface IUserForm extends IUser, FormContainerType {}

interface ChangeEmailSettingsProps {
  errorMessage: string;
  user: IUser;
  loading: boolean;
  onSave: (formData: ChangeEmailSettingFormType) => void;
  onCancel: (data: { changeEmailCode: string }) => void;
}

export const ChangeEmailSettings: React.FC<ChangeEmailSettingsProps> = (props: ChangeEmailSettingsProps) => {
  const { errorMessage, user, onSave, onCancel, loading } = props;
  const saveFn = React.useCallback(async ({ email }: IUserForm) => onSave({ newEmail: email, oldEmail: user.email }), [onSave, user]);

  const pendingEmail = (user.emailHistory || [])?.find(
    (email) => email.confirmed === false && user.email === email.oldEmail && !email.revertChangeEmailCode
  );

  if (loading) {
    return (
      <ChangeEmailContainer>
        <p>Loading...</p>
      </ChangeEmailContainer>
    );
  }

  if (pendingEmail) {
    return (
      <>
        <ErrorAlert message={errorMessage} />
        <PendingEmailChange
          onCancel={() => onCancel({ changeEmailCode: pendingEmail.changeEmailCode || '' })}
        />
      </>
    );
  }

  return (
    <ChangeEmailContainer>
      <Form.Provider>
        <Form.Container className="general-settings-form" onSave={saveFn}>
          <EmailField name='email' initialValue={user.email} validators={(email)=> email === user.email ? 'Unchanged email' : null }/>
          <ErrorAlert message={errorMessage} />
          <div className='button-container'>
            <Form.Button.Submit
              variant="contained"
              color="primary"
              endIcon={<Icon path={mdiContentSaveOutline} size={1}/>}
              fullWidth={false}
            >
              Change Email
            </Form.Button.Submit>
          </div>
        </Form.Container>
      </Form.Provider>
    </ChangeEmailContainer>
  );
};
