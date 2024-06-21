import Stack from '@mui/material/Stack';
import './Account.scss';
import { AccountSettings } from './AccountSettings';
import { DeleteAccount } from './DeleteAccount';
import { GeneralSettings } from './GeneralSettings';

export const Account: React.FC = () => {
	const isFormValid = true;
	const errorMessage = '';
	const user = {
		name: 'John Doe',
		email: 'john@example.com',
	};
	const onSave = console.log;
	const onChange = console.log;
	const onDelete = console.log;
	const config = {
		publicProfile: true,
	};

	return (
		<Stack spacing={2}>
			<GeneralSettings isFormValid={isFormValid} errorMessage={errorMessage} user={user} onSave={onSave} />
			<AccountSettings onChange={onChange} config={config}/>
			<DeleteAccount onDelete={onDelete} />
		</Stack>
	);
}
