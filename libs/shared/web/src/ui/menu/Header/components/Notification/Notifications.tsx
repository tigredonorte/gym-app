import { mdiBellOutline } from '@mdi/js';
import { List, Menu } from '@mui/material';
import React, { useState } from 'react';
import { HeaderMenuIcon } from '../MenuIcon';
import { INotification, NotificationComponent } from './Notification';

interface NotificationsProps {
  notifications: INotification[];
  count: number;
  label: string
}

export const NotificationsComponent: React.FC<NotificationsProps> = ({ notifications = [], count = 0, label = '' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <HeaderMenuIcon
        icon={mdiBellOutline}
        onClick={handleOpen}
        count={count}
        label={label}
        ariaLabel="notifications"
      />
      {anchorEl && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {notifications.length > 0 ? (
            <List>
              {notifications?.map((notification) => (
                <NotificationComponent key={notification.id} notification={notification} />
              ))}
            </List>
          ) : <List>There are no notifications</List>}
        </Menu>
      )}
    </>
  );
};
