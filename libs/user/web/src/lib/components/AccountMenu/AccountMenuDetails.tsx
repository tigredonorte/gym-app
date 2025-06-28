import { Avatar, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface AccountMenuDetailsProps {
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
}

export const AccountMenuDetails: React.FC<AccountMenuDetailsProps> = ({ userName, userEmail, userProfileImage }: AccountMenuDetailsProps) => (
  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>{userEmail}</Typography>
    <Avatar src={userProfileImage} alt="Profile Picture" sx={{ width: 60, height: 60, marginBottom: 2 }} />
    <Typography variant="h6" sx={{ marginBottom: 2 }}>{userName ? `Hi, ${userName}!` : 'Hi!'}</Typography>
  </Box>
);
