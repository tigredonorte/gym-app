import { IDeviceInfo } from '@gym-app/user/types';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DeviceActionButtonProps {
  isCurrentDevice: boolean;
  logoutDevice?: (device: IDeviceInfo) => void;
  device: IDeviceInfo;
}

export const DeviceActionButton: React.FC<DeviceActionButtonProps> = ({ isCurrentDevice, logoutDevice, device }) => {
  const { t } = useTranslation('user');

  if (!isCurrentDevice) {
    return logoutDevice && (
      logoutDevice && (
        <IconButton
          aria-label={t('DeviceActionButton.close')}
          size="small"
          sx={{ float: 'right' }}
          onClick={() => logoutDevice(device)}
        >
          <Icon path={mdiClose} size={1} />
        </IconButton>
      )
    );
  }

  return (
    <Tooltip title={t('DeviceActionButton.currentDevice')} arrow>
      <span>
        <IconButton aria-label={t('DeviceActionButton.close')} size="small" sx={{ float: 'right' }} disabled>
          <Icon path={mdiClose} size={1} />
        </IconButton>
      </span>
    </Tooltip>
  );
};
