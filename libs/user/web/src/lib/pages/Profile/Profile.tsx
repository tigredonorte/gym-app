import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { CardHeader } from '@gym-app/ui';

export const Profile: React.FC = () => {
	return (
		<Stack spacing={6}>
			<ProfileSection />
		</Stack>
	);
};

const ProfileSection: React.FC = () => {
	return (
		<Card>
			<CardHeader title="Profile Information" />
			<Stack spacing={6}>
				<form onSubmit={console.log}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={6}>
							<TextField label="First Name" variant="outlined" defaultValue="Elizabeth" fullWidth />
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField label="Last Name" variant="outlined" defaultValue="Lumaad Olsen" fullWidth />
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField
								type="email"
								label="Account Email"
								variant="outlined"
								defaultValue="demo@sample.com"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField label="Phone Number" variant="outlined" defaultValue="000-00-00-00" fullWidth />
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField label="Company Name" variant="outlined" defaultValue="company.ltd" fullWidth />
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField
								label="Site Information"
								variant="outlined"
								defaultValue="www.company.com"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<Stack spacing={3}>
								<TextField select fullWidth label="Location" variant="outlined" defaultValue="1">
									<MenuItem value="1">CDMX </MenuItem>
									<MenuItem value="2">India </MenuItem>
									<MenuItem value="3">Africa</MenuItem>
									<MenuItem value="4">New York</MenuItem>
								</TextField>
								<TextField select fullWidth label="Experience" variant="outlined" defaultValue="1">
									<MenuItem value="1">1 year </MenuItem>
									<MenuItem value="2">2 year </MenuItem>
									<MenuItem value="3">3 year</MenuItem>
									<MenuItem value="4">4 year</MenuItem>
								</TextField>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={6}>
							<TextField
								multiline
								minRows={5}
								label="Bio"
								defaultValue="I consider myself as a creative, professional and a flexible person. I can adapt with any kind of brief and design style"
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Button
								disableElevation
								variant="contained"
								endIcon={<Icon path={mdiPencil} size={1} />}
								sx={{
									float: 'right',
								}}
							>
								Update Account
							</Button>
						</Grid>
					</Grid>
				</form>
			</Stack>
		</Card>
	);
};
