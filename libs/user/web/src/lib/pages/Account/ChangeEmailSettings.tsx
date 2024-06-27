import { EmailField, ErrorAlert } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader } from '@gym-app/ui';
import { mdiContentSaveOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import './Account.scss';

export interface ChangeEmailSettingFormType extends FormContainerType {
  email: string;
}

export interface IUser {
  email: string;
}

interface ChangeEmailSettingsProps {
  errorMessage: string;
  isFormValid: boolean;
  user: IUser;
  onSave: (formData: ChangeEmailSettingFormType) => void;
}

export const ChangeEmailSettings: React.FC<ChangeEmailSettingsProps> = (props: ChangeEmailSettingsProps) => {
  const { errorMessage, isFormValid, user, onSave } = props;
  return (
    <Card>
      <CardHeader title="Change Email" />
      <Form.Provider>
        <Form.Container className="general-settings-form" onSave={onSave}>
          <EmailField name='name' initialValue={user.email} />
          <ErrorAlert message={errorMessage} />
          <div className='button-container'>
            <Form.Button.Submit
              disabled={!isFormValid}
              variant="contained"
              color="primary"
              endIcon={<Icon path={mdiContentSaveOutline} size={1}/>}
              fullWidth={false}
            >
                Save
            </Form.Button.Submit>
          </div>
        </Form.Container>
      </Form.Provider>
    </Card>
  );
};