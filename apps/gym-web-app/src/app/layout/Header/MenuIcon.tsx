import { Badge, IconButton, MenuItem, SvgIcon } from '@mui/material';

export interface MenuIconProps {
  label?: string;
  Icon?: typeof SvgIcon;
  count?: number;
  ariaLabel?: string;
  onClick?: () => void;
}

export const HeaderMenuIcon = (props: MenuIconProps) => {
  const { Icon, count, label, ariaLabel, onClick } = props;

  if (!label && !Icon) {
    throw new Error('Icon or label must be provided');
  }

  const iconButton = Icon && (
    <IconButton size="large" aria-label={ariaLabel} color="inherit" onClick={() => !label && onClick?.()}>
      <Badge badgeContent={count} color="error">
        <Icon />
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
