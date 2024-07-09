import { EmailField, ErrorAlert } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader } from '@gym-app/ui';
import { mdiContentSaveOutline, mdiDeleteOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import { IUser } from '../../models/IUser';
import './Account.scss';

interface PendingEmailChangeProps {
  onCancel: () => void;
}
export const PendingEmailChange: React.FC<PendingEmailChangeProps> = ({ onCancel }: PendingEmailChangeProps) => {
  return (
    <Card>
      <CardHeader title="Change Email" />
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
    </Card>
  );
};

export interface ChangeEmailSettingFormType extends FormContainerType {
  newEmail: string;
  oldEmail: string;
}

interface IUserForm extends IUser, FormContainerType {}

interface ChangeEmailSettingsProps {
  errorMessage: string;
  user: IUser;
  onSave: (formData: ChangeEmailSettingFormType) => void;
  onCancel: (data: { changeEmailCode: string }) => void;
}

export const ChangeEmailSettings: React.FC<ChangeEmailSettingsProps> = (props: ChangeEmailSettingsProps) => {
  const { errorMessage, user, onSave, onCancel } = props;
  const saveFn = async ({ email }: IUserForm) => onSave({ newEmail: email, oldEmail: user.email });

  const pendingEmail = (user.emailHistory || [])?.find(
    (email) => email.confirmed === false && user.email === email.oldEmail && !email.revertChangeEmailCode
  );

  if (pendingEmail) {
    return (
      <PendingEmailChange
        onCancel={() => onCancel({ changeEmailCode: pendingEmail.changeEmailCode || '' })}
      />
    );
  }

  return (
    <Card>
      <CardHeader title="Change Email" />
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
    </Card>
  );
};
