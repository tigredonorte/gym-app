import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFormContext } from './FormContext';

const FormErrorSnackbar: React.FC = () => {
  const { error, clearError } = useFormContext();

  if (!error) return null; // Don't render if there's no error

  return (
    <Snackbar open={!!error.message} autoHideDuration={6000} onClose={clearError}>
      <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
        {error.title}: {error.message}
      </Alert>
    </Snackbar>
  );
};
export default FormErrorSnackbar;
