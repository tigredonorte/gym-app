import { mdiAccountCircle, mdiLogout } from '@mdi/js';
import { Avatar, Box, Divider, IconButton, Menu, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AccountItem } from './AccountItem';

interface AccountProps {
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
}

export const Account: React.FC<AccountProps> = ({ userName, userEmail, userProfileImage }) => {

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
        color="inherit"
      >
        {userProfileImage ? (
          <Avatar src={userProfileImage} alt="Profile Picture" />
        ) : (
          <Avatar>{userName ? userName[0] : 'A'}</Avatar>
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
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>{userEmail}</Typography>
          <Avatar src={userProfileImage} alt="Profile Picture" sx={{ width: 60, height: 60, marginBottom: 2 }} />
          <Typography variant="h6" sx={{ marginBottom: 2 }}>{userName ? `Hi, ${userName}!` : 'Hi!'}</Typography>
        </Box>
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
