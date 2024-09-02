import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Icon from '@mdi/react';
import { mdiAccountBoxEditOutline } from '@mdi/js';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';

interface UserAvatarSectionProps {
  onChangeImage: (file: File) => void;
}

export const UserAvatarSection: React.FC<UserAvatarSectionProps> = ({ onChangeImage }) => {
  const { t } = useTranslation('user');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChangeImage(file);
    }
  };

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center">
      <Avatar
        alt={t('GeneralSettings.userAvatar')}
        src={'https://picsum.photos/150/150'}
        sx={{
          width: 150,
          height: 150,
          border: 1,
          borderColor: 'primary.light',
        }}
      />

      {/* should refactor into a file picker component */}
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="caption" display="block">
          {t('GeneralSettings.imageLimit')}
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          disableElevation
          size="medium"
          variant="contained"
          endIcon={<Icon path={mdiAccountBoxEditOutline} />}
          onClick={handleButtonClick}
        >
          {t('GeneralSettings.changeImage')}
        </Button>
      </Stack>
    </Stack>
  );
};
