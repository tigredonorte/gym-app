import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface SiteTitleProps {
  siteTitle?: string;
  logo?: {
    src: string;
    alt: string;
  };
}

export function SiteTitleComponent({ siteTitle, logo }: SiteTitleProps) {
  const navigate = useNavigate();

  if (!siteTitle && !logo) {
    return null;
  }

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      {logo && (
        <img src={logo.src} alt={logo.alt} style={{ height: '40px', marginRight: '8px' }} />
      )}
      {siteTitle && (
        <Typography
          variant="h5"
          noWrap
          color="inherit"
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          {siteTitle}
        </Typography>
      )}
    </Box>
  );
}
