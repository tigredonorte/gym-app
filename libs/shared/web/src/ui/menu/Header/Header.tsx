import { AppBar, Box, Toolbar } from '@mui/material';
import { SiteTitleComponent, SiteTitleProps } from './components/SiteTitle/SiteTitle';

export interface HeaderProps {
  titleProps: SiteTitleProps;
  children?: React.ReactNode;
  alignRight?: boolean;
  rightComponent?: React.ReactNode;
}

export function Header({ children, titleProps, alignRight, rightComponent }: HeaderProps): JSX.Element {
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
        {rightComponent}
      </Toolbar>
    </AppBar>
  );
}
