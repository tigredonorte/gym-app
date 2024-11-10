import { Header, SearchComponent } from '@gym-app/shared/web';
import { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/system';

export const TemplateComponent = ({ children }: { children: React.ReactNode }) => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Header
        alignRight
        titleProps={{
          siteTitle: isSmallScreen ? '' : 'Gym App',
          logo: {
            alt: 'Gym App Logo',
            src: '/logo/logo.jpg',
          }
        }}
      >
        {/* <NotificationsComponent
          label={isSmallScreen ? '' : 'Notifications'}
          count={3}
          notifications={[
            {
              id: '1',
              message: 'You have a new message',
              timestamp: new Date().toISOString(),
              link: '/messages/1',
            },
            {
              id: '2',
              message: 'You have a new message',
              timestamp: new Date().toISOString(),
              link: '/messages/2',
            },
            {
              id: '3',
              message: 'You have a new message',
              timestamp: new Date().toISOString(),
              link: '/messages/3',
            },
          ]}
        />*/}
        <SearchComponent />
      </Header>
      <main>
        {children}
      </main>
    </>
  );
};
