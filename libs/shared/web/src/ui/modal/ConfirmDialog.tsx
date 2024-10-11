import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  status: 'success' | 'error' | 'warning' | 'info';
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open: isOpen, title, message, status, buttonLabel = 'Ok', onConfirm }) => {

  const [open, setOpen] = React.useState(isOpen);

  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ color: (theme) => theme.palette[status].main, fontSize: 20, fontWeight: 'bold' }}
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
            onConfirm();
          }}
          sx={{ color: (theme) => theme.palette[status].main }}
          autoFocus
        >
          {buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
