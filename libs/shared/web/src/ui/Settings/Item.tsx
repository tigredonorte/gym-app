import { Typography } from '@mui/material';
import { Stack } from '@mui/system';

interface ItemProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export const Item: React.FC<ItemProps> = ({ title, subtitle, children }: ItemProps) => (
  <Stack direction="row" justifyContent="space-between">
    <div>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {subtitle}
      </Typography>
    </div>
    {children}
  </Stack>
);