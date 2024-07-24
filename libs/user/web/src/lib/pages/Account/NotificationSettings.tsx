import { Settings } from '@gym-app/ui';
import { Alert, AlertTitle, Switch } from '@mui/material';

interface NotificationSettingsProps {
  onChange(option: string, value: boolean): void
  config: Record<string, boolean>
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = (props: NotificationSettingsProps) => {
  const { onChange, config } = props;
  return (
    <Settings.Container title='Notifications'>
      <Alert severity="warning">
        <AlertTitle>Alert!</AlertTitle>
				Transactional notifications cannot be disabled
      </Alert>
      <Settings.Item
        title="Allow transactional notifications"
        subtitle="Receive notifications about account activity and important updates"
      >
        <Switch defaultChecked={config?.publicProfile} onChange={(e,value) => onChange('publicProfile', value)} disabled />
      </Settings.Item>
    </Settings.Container>
  );
};