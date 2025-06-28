import Icon from '@mdi/react';
import Card from '@mui/material/Card';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import React from 'react';
import { calcLayoutHeight } from '../../utils';

export interface MenuOption {
  id: string;
  name: string;
  icon: string;
  text: string;
}

interface StickyMenuProps {
  menuOptions: MenuOption[];
  activeSection: string;
  changeSectionHandler: (menuItem: MenuOption) => void;
}
export const StickyMenu: React.FC<StickyMenuProps> = ({ menuOptions, activeSection, changeSectionHandler }) => (
  <Card
    sx={{
      position: 'sticky',
      top: `${calcLayoutHeight('nav')}px`,
    }}
    component="aside"
  >
    <MenuList
      sx={{
        '& .MuiMenuItem-root': {
          borderRadius: 2,
        },
      }}
    >
      {menuOptions.map((menuItem) => ((
        <MenuItem key={`stickyMenuItem${menuItem.id}`} selected={activeSection === menuItem.name} onClick={() => changeSectionHandler(menuItem)}>
          <ListItemIcon>
            <Icon path={menuItem.icon} size={1} />
          </ListItemIcon>
          {menuItem.text}
        </MenuItem>
      )))}
    </MenuList>
  </Card>
);
