import Icon from '@mdi/react';
import { IconProps } from '@mdi/react/dist/IconProps';
import { Avatar } from '@mui/material';

export const FormIcon: React.FC<IconProps> = (props) => (
  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
    <Icon {...props} size={1}/>
  </Avatar>
);
