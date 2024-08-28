import { Settings } from '@gym-app/ui';
import { Alert, AlertTitle, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NotificationSettingsProps {
  onChange(option: string, value: boolean): void;
  config: Record<string, boolean>;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = (props: NotificationSettingsProps) => {
  const { onChange, config } = props;
  const { t } = useTranslation('user');

  return (
    <Settings.Container title={t('NotificationSettings.title')}>
      <Alert severity="warning">
        <AlertTitle>{t('NotificationSettings.alert')}</AlertTitle>
        {t('NotificationSettings.nonDisableNotice')}
      </Alert>
      <Settings.Item
        title={t('NotificationSettings.allowTransactional')}
        subtitle={t('NotificationSettings.receiveNotifications')}
      >
        <Switch
          defaultChecked={config?.publicProfile}
          onChange={(e, value) => onChange('publicProfile', value)}
          disabled
        />
      </Settings.Item>
    </Settings.Container>
  );
};
