
import { CardHeader, CrudContainer } from '@gym-app/ui';
import { mdiCellphone, mdiDesktopTower, mdiTablet } from '@mdi/js';
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { differenceInDays, format, formatDistanceToNow, isBefore, subWeeks } from 'date-fns';
import React from 'react';
import { ActionStatus } from '../../../reducer';
import { IDeviceInfo } from '../../../reducer/session.types';
import { DeviceActionButton } from './DeviceActionButton';

export interface HistoryRow {
  time: string;
  ip: string;
  client: string;
}
export interface Device {
  TypeIcon: string;
  device: string;
  os: string;
  active: boolean;
  last?: string;
  browser: string;
  isCurrentDevice: boolean;
}

const IconMap: Record<string, string> = {
  desktop: mdiDesktopTower,
  tablet: mdiTablet,
  mobile: mdiCellphone,
};
const oneWeekAgo = subWeeks(new Date(), 1);
const mapDevice = (deviceInfo: IDeviceInfo): Device => {
  const { browser, device, os, updatedAt, isCurrentDevice } = deviceInfo;
  const TypeIcon = IconMap[device?.type || 'desktop'];
  const browserName = [browser?.name, browser?.major || browser?.version].filter(Boolean).join(' ').trim() || 'Unknown Browser';
  const deviceName = [device?.vendor, device?.model].filter(Boolean).join(' ').trim() || '';
  const osName = [os?.name, os?.version].filter(Boolean).join(' ').trim() || 'Unknown OS';
  const status = updatedAt && differenceInDays(new Date(), new Date(updatedAt)) > 1 ? 'inactive' : 'active';
  let last = 'N/A';
  if (updatedAt) {
    const updatedAtDate = new Date(updatedAt);
    if (isBefore(updatedAtDate, oneWeekAgo)) {
      last = 'on ' + format(updatedAtDate, 'MMM d, yyyy');
    } else {
      last = formatDistanceToNow(updatedAtDate, { addSuffix: true });
    }
  }
  return ({
    TypeIcon,
    browser: browserName,
    device: deviceName,
    os: osName,
    active: status === 'active',
    last,
    isCurrentDevice,
  });
};

interface ActiveDevicesSessionProps {
  devices: IDeviceInfo[] | undefined;
  status: ActionStatus | undefined;
  logoutDevice?: (device: IDeviceInfo) => void;
  logoutAll?: (devices: IDeviceInfo[]) => void;
}
export const ActiveDevicesSession: React.FC<ActiveDevicesSessionProps> = React.memo((props: ActiveDevicesSessionProps) => {
  const { devices, status, logoutDevice, logoutAll } = props;

  return (
    <CrudContainer
      loading={status?.loading || false}
      loadingMessage="Loading user devices"
      errorMessage={status?.error || ''}
      emptyMessage="No devices found"
      data={devices}
      Container={Card}
      Header={
        <CardHeader title="Active Devices" subtitle='Your active devices'>
          { logoutAll && (
            <Button variant="text" color="error" onClick={() => logoutAll(devices?.filter(device => !device.isCurrentDevice) || [])}>
              Logout all
            </Button>
          )}
        </CardHeader>
      }
    >
      <Stack spacing={1}>
        {devices?.map(mapDevice).map(({ TypeIcon, device, os, active, browser, last, isCurrentDevice }, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1}>
            <Icon path={TypeIcon} size={1} />
            <Typography variant="body1" flexGrow={1}>
              {device && <Typography variant="caption">{device}</Typography>}
              {browser && <Typography variant="caption">{device ? ' | ' : ''}{browser}</Typography>}
              {os && <Typography variant="caption"> | {os}</Typography>}
            </Typography>
            <Typography color={active ? 'success.main' : 'text.secondary'} variant="caption">
              <Box
                width={10}
                height={10}
                bgcolor={active ? 'success.main' : 'text.secondary'}
                borderRadius="50%"
                display="inline-block"
                mr={1}
              />
              {active ? 'Current Active' : `Active ${last}`}
            </Typography>

            <DeviceActionButton
              isCurrentDevice={isCurrentDevice}
              logoutDevice={logoutDevice}
              device={devices[i]}
            />
          </Stack>
        ))}
      </Stack>
    </CrudContainer>
  );
});
