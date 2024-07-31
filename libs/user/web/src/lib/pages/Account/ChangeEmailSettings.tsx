import { EmailField, ErrorAlert } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader, CrudContainer } from '@gym-app/ui';
import { mdiContentSaveOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import React from 'react';
import { IUser } from '../../reducer';
import { ChangeEmailSettingFormType } from '../../reducer/UserActions';
import { PendingChangeChange } from '../Security/components/PendingChangeConfirmation';
import './Account.scss';

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

  if (pendingEmail) {
    return (
      <>
        <ErrorAlert message={errorMessage} />
        <PendingChangeChange
          title='Change email'
          subtitle='You have a pending email change request. Access your email to confirm the change..'
          onCancel={() => onCancel({ changeEmailCode: pendingEmail.changeEmailCode || '' })}
        />
      </>
    );
  }

  return (
    <CrudContainer
      loading={loading}
      loadingMessage="Loading user"
      errorMessage={errorMessage}
      emptyMessage="No user found"
      data={user}
      Header={<CardHeader title="Change Email" subtitle='Only one email change request can be pending at a time'/>}
      Container={Card}
    >
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
    </CrudContainer>
  );
};
