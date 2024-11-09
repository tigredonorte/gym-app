import { ErrorAlert, NameField } from '@gym-app/auth/web';
import { CardBody, CardHeader, Form, FormContainerType } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import { mdiContentSaveOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('user');
  const { errorMessage, user, onSave, loading } = props;

  return (
    <Grid container alignItems="stretch" spacing={2} sx={{ width: '100%' }}>


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
  );
};
