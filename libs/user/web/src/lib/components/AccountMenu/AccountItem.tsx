import Icon from '@mdi/react';
import { IconButton, MenuItem } from '@mui/material';
import React from 'react';

interface AccountItemProps {
  isActive: boolean
  onClick: () => void
  label: string
  icon?: string
}

export const AccountItem: React.FC<AccountItemProps> = ({ isActive, onClick, label, icon }) => (
  <MenuItem
    onClick={onClick}
    selected={isActive}
  >
    {icon && (
      <IconButton size="large" color="inherit">
        <Icon size={1} path={icon} />
      </IconButton>
    )}
    { label }
  </MenuItem>
);
