import { mdiLoading } from '@mdi/js';
import Icon from '@mdi/react';
import { Box, Icon as MuiIcon, Typography } from '@mui/material';

interface CrudBoxPros {
  children?: React.ReactNode
  icon?: string
  text?: string
  color?: 'error' | 'info'
}

export const CrudBox = ({ children, icon, text, color }: CrudBoxPros) => (
  <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" margin="20px">
    {icon && (
      <MuiIcon color={color} sx={{ fontSize: 48 }}>
        <Icon path={icon} size={2} spin={icon === mdiLoading}/>
      </MuiIcon>
    )}

    {text && (
      <Typography variant="body1" color={color ? `${color}.main` : undefined} marginTop="10px">
        {text}
      </Typography>
    )}
    {children && <Box marginTop="10px">{children}</Box>}
  </Box>
);