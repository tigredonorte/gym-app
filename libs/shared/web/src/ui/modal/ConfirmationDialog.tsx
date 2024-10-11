import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open: isOpen, title, message, onCancel, onConfirm }) => {

  const [open, setOpen] = React.useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  });

  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ color: (theme) => theme.palette.info.main, fontSize: 20, fontWeight: 'bold' }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ fontSize: 14 }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            onCancel();
          }}
          sx={{ color: (theme) => theme.palette.warning.main }}
          autoFocus
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          sx={{ color: (theme) => theme.palette.info.main }}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
