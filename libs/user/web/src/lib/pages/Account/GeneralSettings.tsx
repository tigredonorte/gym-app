import { ErrorAlert, NameField } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader } from '@gym-app/ui';
import { mdiAccountBoxEditOutline, mdiContentSaveOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IUser } from '../../reducer';
import './Account.scss';

export interface GeneralSettingFormType extends FormContainerType {
  name: string;
}

interface GeneralSettingsProps {
  errorMessage: string;
  user: IUser;
  loading: boolean;
  onSave: (formData: GeneralSettingFormType) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = (props: GeneralSettingsProps) => {
  const { errorMessage, user, onSave, loading } = props;
  return (
    <Card>
      <CardHeader title="General Settings" />
      <Stack spacing={2}>
        <Stack spacing={2} alignItems="center" justifyContent="center">
          <Avatar
            alt="User Img"
            src={'https://picsum.photos/150/150'}
            sx={{
              width: 150,
              height: 150,
              border: 1,
              borderColor: 'primary.light',
            }}
          />
          <Stack alignItems="center" justifyContent="center">
            <Typography variant="caption" display="block">
              Image size Limit should be 125kb Max.
            </Typography>
            <Button disableElevation size="medium" variant="contained" endIcon={<Icon path={mdiAccountBoxEditOutline}/>}>
              Change Image
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Form.Provider>
          <Form.Container className="general-settings-form" onSave={onSave}>
            <NameField name='name' initialValue={user.name} />
            <ErrorAlert message={errorMessage} />
            <div className='button-container'>
              <Form.Button.Submit
                variant="contained"
                color="primary"
                endIcon={<Icon path={mdiContentSaveOutline} size={1}/>}
                fullWidth={false}
                disabled={loading}
              >
                Save
              </Form.Button.Submit>
            </div>
          </Form.Container>
        </Form.Provider>
      </Stack>
    </Card>
  );
};
