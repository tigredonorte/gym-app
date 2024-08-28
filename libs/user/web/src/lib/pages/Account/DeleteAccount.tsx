import { CardHeader, ConfirmationDialog } from '@gym-app/ui';
import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteAccountProps {
  onDelete(): void;
}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({ onDelete }: DeleteAccountProps) => {
  const { t } = useTranslation('user');
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
        <CardHeader title={t('DeleteAccount.title')} />
        <Typography mb={2}>
          {t('DeleteAccount.warning')}
        </Typography>
        <Button variant="outlined" color="error" onClick={() => setDialog(true)}>
          {t('DeleteAccount.title')}
        </Button>
      </Stack>

      <ConfirmationDialog
        open={!!dialog}
        title={t('deleteAccount.confirm.title')}
        message={t('deleteAccount.confirm.message')}
        onConfirm={() => deleteAccount()}
        onCancel={() => setDialog(false)}
      />
    </>
  );
};
