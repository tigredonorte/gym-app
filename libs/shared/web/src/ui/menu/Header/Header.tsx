import { ConnectedAccount } from '@gym-app/user/web';
import { AppBar, Box, Toolbar } from '@mui/material';
import { SiteTitleComponent, SiteTitleProps } from './components/SiteTitle/SiteTitle';

export interface HeaderProps {
  titleProps: SiteTitleProps;
  children?: React.ReactNode;
  alignRight?: boolean;
}

export function Header({ children, titleProps, alignRight }: HeaderProps): JSX.Element {
  return (
    <AppBar position="static">
      <Toolbar sx={{
        px: { xs: 0, sm: 0 },
        color: 'white',
      }}>
        <SiteTitleComponent {...titleProps} />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: alignRight ? 'flex-end' : 'flex-start',
          }}>
          {children}
        </Box>
        <ConnectedAccount />
      </Toolbar>
    </AppBar>
  );
}
