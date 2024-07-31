import { CardHeader, ConfirmationDialog } from '@gym-app/ui';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';

interface DeleteAccountProps {
  onDelete(): void
}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({ onDelete }: DeleteAccountProps) => {

  const [dialog, setDialog] = React.useState(false);
  const deleteAccount = React.useCallback(() => {
    onDelete();
    setDialog(false);
  }, [onDelete]);

  return (
    <>
      <Stack
        sx={{
          borderRadius: 1,
          border: 2,
          borderColor: 'red',
          borderStyle: 'dotted',
          bgcolor: 'background.paper',
          p: 3,
        }}
      >
        <CardHeader title="Delete Account" />
        <Typography mb={2}>
          Once you delete your account, there is no going back. Please be certain.
        </Typography>
        <Button variant="outlined" color="error" onClick={() => setDialog(true)}>
          Delete Account
        </Button>
      </Stack>

      <ConfirmationDialog
        open={!!dialog}
        title="Delete Account"
        message="Are you sure you want to delete your account?"
        onConfirm={() => deleteAccount()}
        onCancel={() => setDialog(false)}
      />
    </>
  );
};