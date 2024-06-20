import { CardHeader, Settings } from '@gym-app/ui';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './Account.scss';
import { GeneralSettings } from './GeneralSettings';

export const Account: React.FC = () => {
	const isFormValid = true;
	const errorMessage = '';
	const user = {
		name: 'John Doe',
		email: 'john@example.com',
	};
	const onSave = console.log;

	return (
		<Stack spacing={2}>
			<GeneralSettings isFormValid={isFormValid} errorMessage={errorMessage} user={user} onSave={onSave} />
			<ProfileSettingsSection />
			<DeleteAccountSection />
		</Stack>
	);
}


const ProfileSettingsSection: React.FC = () => {
	return (
		<Settings.Container title='Public Profile'>
			<Settings.Item 
				title="Make Contact Info Public"
				subtitle="Means that anyone viewing your profile will be able to see your contacts details."
			/>
			<Settings.Item 
				title="Available to hire"
				subtitle="Toggling this will let your teammates know that you are available for acquiring new projects."
			/>
		</Settings.Container>
	);
}

const DeleteAccountSection: React.FC = () => {
	return (
		<Stack
			sx={{
				borderRadius: 1,
				border: 2,
				borderColor: 'red',
				borderStyle: 'dotted',
				bgcolor: 'background.paper',
				p: 3,
			}}
		>
			<CardHeader title="Delete Account" />
			<Typography mb={2}>
				Once you delete your account, there is no going back. Please be certain.
			</Typography>
			<Button variant="outlined" color="error">
				Desactivate Account
			</Button>
		</Stack>
	);
}

