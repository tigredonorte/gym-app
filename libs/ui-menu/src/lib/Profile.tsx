import { mdiAccountCircle } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';

export interface ProfileProps {
  menuId: string;
  isMobile?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLAnchorElement> | undefined;
}
export const Profile = (props: ProfileProps) => {

  const { onClick, isMobile, menuId } = props;

  if (!isMobile) {
    return (
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement> }
        color="inherit"
        >
        <Icon path={mdiAccountCircle} size={1.6} />
      </IconButton> 
    );
  }
  return (
    <MenuItem onClick={onClick as React.MouseEventHandler<unknown> }>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        color="inherit"
      >
        <Icon path={mdiAccountCircle} size={1} />
      </IconButton>
      <p>Profile</p>
    </MenuItem>
  );
}
