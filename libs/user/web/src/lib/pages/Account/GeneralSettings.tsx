import { EmailField, ErrorAlert, NameField } from '@gym-app/auth/web';
import { Form, FormContainerType } from '@gym-app/total-form';
import { CardHeader } from '@gym-app/ui';
import { mdiAccountBoxEditOutline, mdiContentSave } from '@mdi/js';
import Icon from '@mdi/react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './Account.scss';

interface FormType extends FormContainerType {
  name: string;
  email: string;
}

interface IUser {
  name: string;
  email: string;
}

interface GeneralSettingsProps {
  errorMessage: string;
  isFormValid: boolean;
  user: IUser;
  onSave: (formData: FormType) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = (props: GeneralSettingsProps) => {
  const { errorMessage, isFormValid, user, onSave } = props
	return (
		<Card>
			<CardHeader title="General Settings" />
			<Stack spacing={2}>
				<Stack spacing={2} alignItems="center" justifyContent="center">
					<Avatar
						alt="User Img"
						src={'https://picsum.photos/150/150'}
						sx={{
							width: 150,
							height: 150,
							border: 1,
							borderColor: 'primary.light',
						}}
					/>
					<Stack alignItems="center" justifyContent="center">
						<Typography variant="caption" display="block">
							Image size Limit should be 125kb Max.
						</Typography>
						<Button disableElevation size="medium" variant="contained" endIcon={<Icon path={mdiAccountBoxEditOutline}/>}>
							Change Image
						</Button>
					</Stack>
				</Stack>
				<Divider />
				<Form.Provider>
					<Form.Container className="general-settings-form" onSave={onSave}>
						<NameField name='name' initialValue={user.name} />
						<EmailField name='email' initialValue={user.email} />
						<ErrorAlert message={errorMessage} />
						<div>
							<Button
								disabled={!isFormValid}
								type="submit"
								variant="contained"
								color="primary"
								endIcon={<Icon path={mdiContentSave} />}
								className="full-width"
							>
								Update Account
							</Button>
						</div>
					</Form.Container>
				</Form.Provider>
			</Stack>
		</Card>
	);
}