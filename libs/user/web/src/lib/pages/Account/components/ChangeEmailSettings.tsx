import { EmailField, ErrorAlert } from '@gym-app/auth/web';
import { CardHeader, CloseButton, CrudContainer, Form, FormContainerType } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import { mdiContentSaveOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChangeEmailSettingFormType } from '../../../reducer/UserActions';

interface IUserForm extends IUser, FormContainerType {}

interface ChangeEmailSettingsProps {
  errorMessage: string;
  user: IUser;
  loading: boolean;
  onSave: (formData: ChangeEmailSettingFormType) => void;
}

export const ChangeEmailSettings: React.FC<ChangeEmailSettingsProps> = (props: ChangeEmailSettingsProps) => {
  const [cancelError, setCancelError] = React.useState('');
  const { errorMessage, user, onSave, loading } = props;
  const { t } = useTranslation('user');

  const saveFn = React.useCallback(async ({ email }: IUserForm) => onSave({ newEmail: email, oldEmail: user.email }), [onSave, user]);
  React.useEffect(() => {
    setCancelError(errorMessage);
  }, [errorMessage, setCancelError]);

  return (
    <CrudContainer
      loading={loading}
      loadingMessage={t('ChangeEmailSetting.loadingUser')}
      errorMessage={t(cancelError)}
      ErrorItem={<CloseButton onClick={() => setCancelError('')} />}
      emptyMessage={t('ChangeEmailSetting.noUserFound')}
      data={user}
      Header={
        <CardHeader
          title={t('ChangeEmailSetting.title')}
          subtitle={t('ChangeEmailSetting.oneRequestLimit')}
        />
      }
      Container={Card}
    >
      <Form.Provider>
        <Form.Container className="general-settings-form" onSave={saveFn}>
          <EmailField
            name='email'
            initialValue={user.email}
            validators={(email) => email === user.email ? t('ChangeEmailSetting.unchangedEmail') : null}
          />
          <ErrorAlert message={t(errorMessage)} />
          <div className='button-container'>
            <Form.Button.Submit
              variant="contained"
              color="primary"
              endIcon={<Icon path={mdiContentSaveOutline} size={1}/>}
              fullWidth={false}
            >
              {t('ChangeEmailSetting.title')}
            </Form.Button.Submit>
          </div>
        </Form.Container>
      </Form.Provider>
    </CrudContainer>
  );
};
