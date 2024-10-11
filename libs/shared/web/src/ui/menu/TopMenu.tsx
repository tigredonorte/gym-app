import { HeaderMenuIcon, IMenuItem } from './MenuIcon';
import { Profile } from './Profile';

export interface TopMenuProps {
  menuItems: IMenuItem[];
  profileMenuId: string;
  isMobile?: boolean;
  onMenuClick: (id: string, event?: React.MouseEvent<HTMLElement>) => void;
}

export const TopMenu = (props: TopMenuProps) => {
  const { profileMenuId, menuItems, onMenuClick, isMobile } = props;
  return (
    <>
      {menuItems.map(({ id, label, ...props }) => (
        <HeaderMenuIcon
          key={`menu-item-${id}`}
          onClick={(event?: React.MouseEvent<HTMLElement>) => onMenuClick(id, event)}
          label={isMobile ? label : undefined}
          {...props}
        />
      ))}
      <Profile onClick={(event?: React.MouseEvent<HTMLElement>) => onMenuClick('profile', event)} menuId={profileMenuId} isMobile={isMobile} />
    </>
  );
};
