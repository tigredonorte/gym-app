import Icon from '@mdi/react';
import { Badge, IconButton, MenuItem } from '@mui/material';

export type IMenuItem = {
  id: string;
  count: number;
  icon?: string;
  label?: string;
  ariaLabel?: string;
} & (
  | { icon: string; label?: string }
  | { icon?: string; label: string }
);

export interface MenuIconProps extends Omit<IMenuItem, 'id'> {
  onClick?: () => void;
}

export const HeaderMenuIcon = (props: MenuIconProps) => {
  const { icon, count, label, ariaLabel, onClick } = props;

  if (!label && !icon) {
    throw new Error('Icon or label must be provided');
  }

  const iconButton = Icon && (
    <IconButton size="large" aria-label={ariaLabel} color="inherit" onClick={() => !label && onClick?.()}>
      <Badge badgeContent={count} color="error">
        {icon && <Icon size={1} path={icon} />}
      </Badge>
    </IconButton>
  );

  if (!label) {
    return iconButton;
  }

  return (
    <MenuItem onClick={onClick}>
      {iconButton}
      {label && (<p>{label}</p>)}
    </MenuItem>
  );
};
