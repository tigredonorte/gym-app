import { mdiMenu, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import DrawerMenu, { DrawerMenuItem } from './DrawerMenu';
import { IMenuItem } from './MenuIcon';
import { TopMenu } from './TopMenu';

export interface HeaderProps {
  menuItems?: IMenuItem[];
  drawerMenuItemList?: DrawerMenuItem[];
  siteTitle?: string;
  children?: React.ReactNode;
}

export function Header({ children, siteTitle, drawerMenuItemList, menuItems }: HeaderProps): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const onMenuClick = (menu: string, event?: React.MouseEvent<HTMLElement>) => (menu === 'profile' && event) && setAnchorEl(event.currentTarget);
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMobileMoreAnchorEl(event.currentTarget);
  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={() => navigate('/user/logout')}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = menuItems && menuItems.length > 0 && (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <TopMenu 
        menuItems={menuItems || []}
        profileMenuId={menuId}
        onMenuClick={onMenuClick}
        isMobile
      />
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {drawerMenuItemList && drawerMenuItemList?.length > 0 && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{ mr: 2 }}
            >
              <Icon path={mdiMenu} size={1} />
            </IconButton>
          )}

          {siteTitle && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {siteTitle}
            </Typography>
          )}

          {children}

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <TopMenu 
              menuItems={menuItems || []}
              profileMenuId={menuId}
              onMenuClick={onMenuClick}
              isMobile={false}
            />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <Icon path={mdiPlus} size={1} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      { drawerMenuItemList && (
        <DrawerMenu open={isDrawerOpen} onClose={handleDrawerClose} drawerMenuItemList={drawerMenuItemList} />
      )}
    </Box>
  );
}