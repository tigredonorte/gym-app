import { ErrorAlert, PasswordField } from '@gym-app/auth/web';
import { CardHeader, CrudContainer, Form, FormContainerType } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import { mdiLock } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChangePasswordFormType } from '../../../reducer/UserActions';

interface ChangePasswordSectionProps {
  error: string;
  loading: boolean;
  user: IUser;
  onSave: (formData: ChangePasswordFormType & FormContainerType) => void;
}

export const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = React.memo(({ error, onSave, loading, user }: ChangePasswordSectionProps) => {
  const { t } = useTranslation('user');
  const handleSave = useCallback((formData: ChangePasswordFormType & FormContainerType) => {
    onSave(formData);
  }, [onSave]);

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
        <Form.Container onSave={handleSave}>
          <PasswordField name='oldPassword' label={t('ChangePasswordSection.currentPassword')} />
          <Form.Fields.ConfirmField confirmLabel={t('ChangePasswordSection.confirmPassword')} confirmName="confirmPassword">
            <PasswordField name="newPassword" autoComplete='new-password' label={t('ChangePasswordSection.newPassword')} />
          </Form.Fields.ConfirmField>
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
