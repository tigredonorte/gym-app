import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

export interface INotification {
  id: string;
  message: string;
  timestamp: string;
  link: string;
}

interface NotificationProps {
  notification: INotification;
}

export const NotificationComponent: React.FC<NotificationProps> = ({ notification }) => {
  return (
    <ListItem>
      <ListItemText primary={notification.message} />
    </ListItem>
  );
};
