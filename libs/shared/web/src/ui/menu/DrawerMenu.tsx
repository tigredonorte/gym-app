import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export type DrawerMenuItem = {
  icon: string;
  text: string;
  path: string;
};

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
  drawerMenuItemList: DrawerMenuItem[];
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose, drawerMenuItemList }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!drawerMenuItemList) {
    return null;
  }

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
        <IconButton onClick={onClose}>
          <Icon path={mdiClose} size={1} />
        </IconButton>
        <Divider />
        <List>
          {drawerMenuItemList.map((item) => (
            <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
              <ListItemIcon><Icon path={item.icon} size={1} /></ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
