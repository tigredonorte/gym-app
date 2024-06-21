import { MenuOption, StickyMenu } from '@gym-app/ui';
import { mdiAccountOutline, mdiCreditCardOutline, mdiKeyOutline } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const menuOptions: MenuOption[] = [
	{
		id: uuid(),
		name: 'account',
		icon: mdiAccountOutline,
		text: 'Account',
	},
	{
		id: uuid(),
		name: 'billing',
		icon: mdiCreditCardOutline,
		text: 'Billing',
	},
	{
		id: uuid(),
		name: 'security',
		icon: mdiKeyOutline,
		text: 'Security',
	},
];

export const UserMenu: React.FC = () => {
	const navigate = useNavigate();
	const activeSection = location.pathname.split('/').pop() || 'account';

	return (
		<StickyMenu
			menuOptions={menuOptions}
			activeSection={activeSection}
			changeSectionHandler={(menuItem) => navigate(`/user/${menuItem.name}`)}
		/>
	);
};
