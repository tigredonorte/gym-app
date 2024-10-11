import { ErrorAlert, NameField } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/shared/web';
import { CardBody, CardHeader } from '@gym-app/shared/web';
import { mdiContentSaveOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { IUser } from '../../reducer';
import './Account.scss';
import { UserAvatarSection } from './components/UserAvatar';

export interface GeneralSettingFormType extends FormContainerType {
  name: string;
}

interface GeneralSettingsProps {
  errorMessage: string;
  user: IUser;
  loading: boolean;
  onSave: (formData: GeneralSettingFormType) => void;
  handleChangeImage: (file: File) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = (props: GeneralSettingsProps) => {
  const { t } = useTranslation('user');
  const { errorMessage, user, onSave, handleChangeImage, loading } = props;

  return (
    <Grid container alignItems="stretch" spacing={2} sx={{ width: '100%' }}>

      <Grid container alignItems="stretch" spacing={2}>
        <Grid item xs={12} sm={12} md={5} lg={4} xl={3} display="flex">
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader title={t('GeneralSettings.imageTitle')} />
            <CardBody>
              <UserAvatarSection onChangeImage={handleChangeImage} />
            </CardBody>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={7} lg={8} xl={9} display="flex">
          <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <CardHeader title={t('GeneralSettings.title')} />
            <CardBody>
              <Form.Provider>
                <Form.Container className="general-settings-form" onSave={onSave}>
                  <Stack minWidth={320}>
                    <NameField name='name' initialValue={user.name} />
                    <ErrorAlert message={errorMessage} />

                    <Form.Button.Submit
                      variant="contained"
                      color="primary"
                      endIcon={<Icon path={mdiContentSaveOutline} size={1} />}
                      fullWidth={false}
                      disabled={loading}
                    >
                      {t('GeneralSettings.save')}
                    </Form.Button.Submit>
                  </Stack>
                </Form.Container>
              </Form.Provider>
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};
