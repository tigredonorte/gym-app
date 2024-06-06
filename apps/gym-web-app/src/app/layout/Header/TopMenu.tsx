import { HeaderMenuIcon, MenuIconProps } from "./MenuIcon";
import { Profile } from "./Profile";

export interface TopMenuProps {
  menuItems: {
    id: string;
    Icon: MenuIconProps['Icon'];
    count: number;
    label: string;
    ariaLabel: string;
  }[];
  profileMenuId: string;
  isMobile?: boolean;
  onMenuClick: (id: string, event?: unknown) => void;
}

export const TopMenu = (props: TopMenuProps) => {
  const { profileMenuId, menuItems, onMenuClick, isMobile } = props;
  return (
    <>
      {menuItems.map(({ id, label, ...props }) => (
        <HeaderMenuIcon
          key={`menu-item-${id}`}
          onClick={(...event: unknown[]) => onMenuClick(id, ...event)}
          label={isMobile ? label : undefined}
          {...props}
        />
      ))}
      <Profile onClick={(...event: unknown[]) => onMenuClick('profile', ...event)} menuId={profileMenuId} isMobile={isMobile} />
    </>
  )
}