import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { IDeviceInfo } from '../../../reducer/session.types';

interface DeviceActionButtonProps {
  isCurrentDevice: boolean;
  logoutDevice?: (device: IDeviceInfo) => void;
  device: IDeviceInfo;
}

export const DeviceActionButton: React.FC<DeviceActionButtonProps> = ({ isCurrentDevice, logoutDevice, device }) => {

  if (!isCurrentDevice) {
    return logoutDevice && (
      logoutDevice && (
        <IconButton
          aria-label="close"
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
    <Tooltip title="This is your current device. You cannot log out from the current device." arrow>
      <span>
        <IconButton aria-label="close" size="small" sx={{ float: 'right' }} disabled>
          <Icon path={mdiClose} size={1} />
        </IconButton>
      </span>
    </Tooltip>
  );
};
