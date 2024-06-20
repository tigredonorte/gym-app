import { Alert, Snackbar } from "@mui/material";
interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}
export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  if (!message) {
    return null;
  }

  return (
    <Snackbar
      open={message !== ''}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity="error">
        {message}
      </Alert>
    </Snackbar>
  )
}