import { MenuOption, StickyMenu } from '@gym-app/shared/web';
import { mdiAccountOutline, mdiKeyOutline } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { ProfilePath } from '../User.router';

const menuOptions: MenuOption[] = [
  {
    id: uuid(),
    name: 'account',
    icon: mdiAccountOutline,
    text: 'Account',
  },
  {
    id: uuid(),
    name: 'security',
    icon: mdiKeyOutline,
    text: 'Security',
  },
];

interface UserMenuProps {
  extraMenu?: MenuOption[];
}
export const UserMenu: React.FC<UserMenuProps> = (props: UserMenuProps) => {
  const navigate = useNavigate();
  const activeSection = location.pathname.split('/').pop() || 'account';

  return (
    <StickyMenu
      menuOptions={[...menuOptions, ...(props.extraMenu || [])]}
      activeSection={activeSection}
      changeSectionHandler={(menuItem) => navigate(`/${ProfilePath}/${menuItem.name}`)}
    />
  );
};
