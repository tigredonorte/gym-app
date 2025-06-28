import { mdiAccountCircle, mdiLogout } from '@mdi/js';
import { Avatar, Divider, IconButton, Menu } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountItem } from './AccountItem';
import { AccountMenuDetails } from './AccountMenuDetails';

interface AccountMenuProps {
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ userName, userEmail, userProfileImage }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        {userProfileImage ? (
          <Avatar src={userProfileImage} alt="Profile Picture" />
        ) : (
          <Avatar>{(userName || '')[0]}</Avatar>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { padding: '16px', minWidth: '250px' },
          }
        }}
      >
        <AccountMenuDetails userName={userName} userEmail={userEmail} userProfileImage={userProfileImage} />
        <Divider sx={{ my: 1 }} />
        <AccountItem
          onClick={() => navigate('/profile/account')}
          isActive={isActive('/profile/account')}
          label="Account Settings"
          icon={mdiAccountCircle}
        />
        <AccountItem
          onClick={() => navigate('/user/logout')}
          isActive={isActive('/user/logout')}
          label="Logout"
          icon={mdiLogout}
        />
      </Menu>
    </>
  );
};
