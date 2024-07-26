
import { CardHeader } from '@gym-app/ui';
import { mdiCellphone, mdiClose, mdiDesktopTower, mdiTablet } from '@mdi/js';
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { differenceInDays, format, formatDistance, formatDistanceToNow, isBefore, subWeeks } from 'date-fns';
import React from 'react';
import { IAccessLog, IDeviceInfo, ISession } from '../../reducer/session.types';

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
}

const IconMap: Record<string, string> = {
  desktop: mdiDesktopTower,
  tablet: mdiTablet,
  mobile: mdiCellphone,
};
const oneWeekAgo = subWeeks(new Date(), 1);
const mapDevice = ({ browser, os, device, updatedAt }: IDeviceInfo): Device => {
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
    last
  });
};

interface LoginHistorySectionProps {
  devices?: IDeviceInfo[];
  accesses?: IAccessLog[];
  sessions?: ISession[];
  logoutDevice?: (device: IDeviceInfo) => void;
  removeDevice?: (device: IDeviceInfo) => void;
  logoutAll?: () => void;
}
export const LoginHistorySection: React.FC<LoginHistorySectionProps> = React.memo((props: LoginHistorySectionProps) => {
  const { devices, logoutDevice, removeDevice, logoutAll, accesses } = props;

  if (!devices) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader title="Active Sessions">
          { logoutAll && (
            <Button variant="text" color="error" onClick={() => logoutAll()}>
              Logout all
            </Button>
          )}
        </CardHeader>
        <Stack spacing={1}>
          {devices.map(mapDevice).map(({ TypeIcon, device, os, active, browser, last }, i) => (
            <Stack key={i} direction="row" alignItems="flex-start" spacing={1}>
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
                  bgcolor={active ? 'success.main' : '#d3d3d3'}
                  borderRadius="50%"
                  display="inline-block"
                  mr={1}
                />
                {active ? 'Current Active' : `Active ${last}`}
              </Typography>
              {removeDevice && (
                <IconButton aria-label="close" size="small" sx={{ float: 'right' }} onClick={() => removeDevice(devices[i])}>
                  <Icon path={mdiClose} size={1} />
                </IconButton>
              )}

              {logoutDevice && (
                <Button variant="text" color="error" onClick={() => logoutDevice(devices[i])}>
                  Logout
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
      </Card>
      <Card>
        <CardHeader title="Login history" subtitle="Your recent login activity"/>
        <TableContainer>
          <Table size="small" aria-label="results table">
            <TableHead>
              <TableRow>
                <TableCell>Login Date</TableCell>
                <TableCell align="left">Ip Address</TableCell>
                <TableCell align="left">Client</TableCell>
                <TableCell align="left">Session duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accesses?.map((row, i) => (
                <TableRow hover key={i}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.client || 'Unknown Client'}</Typography>
                    {new Date(row.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="left">{row.ip}</TableCell>
                  <TableCell align="left">
                    {row.location ? `${row.location.city}, ${row.location.region}, ${row.location.country}` : 'Unknown Location'}
                  </TableCell>
                  <TableCell align="left">
                    {formatDistance(new Date(row.createdAt), new Date(row.logoutDate ? row.logoutDate : new Date()))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
});
