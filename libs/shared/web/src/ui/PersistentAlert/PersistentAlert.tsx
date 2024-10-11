import { Alert, AlertTitle } from '@mui/material';

interface PersistentAlertProps {
  message: string;
  severity: 'error' | 'info' | 'success' | 'warning';
  title?: string;
  sx?: Record<string, string>;
  alertProps?: Record<string, string>;
}

export const PersistentAlert = (props: PersistentAlertProps) => {
  const { message, severity, title, sx, alertProps } = props;
  return (
    <Alert severity={severity} sx={{ boxShadow: 27, ...sx }} {...alertProps}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
};
