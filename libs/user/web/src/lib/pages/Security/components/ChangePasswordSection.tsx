import { ErrorAlert, PasswordField } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/shared/web';
import { CardHeader, CrudContainer } from '@gym-app/shared/web';
import { mdiLock } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IUser } from '../../../reducer';
import { ChangePasswordFormType } from '../../../reducer/UserActions';
import { PendingChangeChange } from './PendingChangeConfirmation';

interface ChangePassworSectionProps {
  error: string;
  loading: boolean;
  user: IUser;
  onSave: (formData: ChangePasswordFormType & FormContainerType) => void;
  onCancel: () => void;
}

export const ChangePassworSection: React.FC<ChangePassworSectionProps> = React.memo(({ error, onSave, loading, user, onCancel }: ChangePassworSectionProps) => {
  const { t } = useTranslation('user');
  const handleSave = useCallback((formData: ChangePasswordFormType & FormContainerType) => {
    onSave(formData);
  }, [onSave]);

  const hasPendingRequest = user?.passwordHistory?.some((item) => !item.confirmed && new Date(item.expiresAt) > new Date());
  if (hasPendingRequest) {
    return (
      <PendingChangeChange
        title={t('ChangePasswordSection.title')}
        subtitle={t('ChangePasswordSection.pendingRequest')}
        onCancel={onCancel}
      />
    );
  }

  return (
    <CrudContainer
      loading={loading}
      loadingMessage={t('ChangePasswordSection.loading')}
      errorMessage={t(error)}
      emptyMessage={t('ChangePasswordSection.noSessions')}
      data={user}
      Header={<CardHeader title={t('ChangePasswordSection.changePassword')} subtitle={t('ChangePasswordSection.updateSecurity')} />}
      Container={Card}
    >
      <Form.Provider>
        <Form.Container className="general-settings-form" onSave={handleSave}>
          <Form.Fields.ConfirmField confirmLabel={t('ChangePasswordSection.confirmPassword')} confirmName="confirmPassword">
            <PasswordField name="newPassword" label={t('ChangePasswordSection.newPassword')} />
          </Form.Fields.ConfirmField>
          <PasswordField name='oldPassword' label={t('ChangePasswordSection.currentPassword')}  />
          <ErrorAlert message={t(error)} />
          <div className='button-container'>
            <Form.Button.Submit
              variant="contained"
              color="primary"
              endIcon={<Icon path={mdiLock} size={1}/>}
              fullWidth={false}
              disabled={loading}
            >
              {t('ChangePasswordSection.changePassword')}
            </Form.Button.Submit>
          </div>
        </Form.Container>
      </Form.Provider>
    </CrudContainer>
  );
});
