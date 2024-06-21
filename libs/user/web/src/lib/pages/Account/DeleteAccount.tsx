import { CardHeader } from "@gym-app/ui";
import { Button, Stack, Typography } from "@mui/material";

interface DeleteAccountProps {
  onDelete(): void
}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({ onDelete }: DeleteAccountProps) => (
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
    <Button variant="outlined" color="error" onClick={() => onDelete()}>
      Delete Account
    </Button>
  </Stack>
);