/* eslint-disable react-native/no-inline-styles */
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { Button } from '@mui/material';
import React from 'react';

interface CloseButtonProps {
  message?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick: () => void;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  message = 'Close',
  color = 'error',
  onClick,
}: CloseButtonProps) => (
  <Button type='button' variant='contained' color={color} onClick={onClick}>
    {message}
    <span style={{ marginLeft: 5, display: 'flex' }}>
      <Icon path={mdiClose} size={.8} />
    </span>
  </Button>
);
