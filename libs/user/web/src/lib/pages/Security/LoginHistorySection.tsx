
import { CardHeader } from '@gym-app/ui';
import { mdiClose } from '@mdi/js';
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
import React from 'react';

export interface HistoryRow {
  time: string;
  ip: string;
  client: string;
}
export interface Device {
  TypeIcon: string;
  device: string;
  ubication: string;
  active: boolean;
  last?: string;
}

interface LoginHistorySectionProps {
  history: HistoryRow[];
  devices: Device[];
  logoutDevice: (device: Device) => void;
  removeDevice: (device: Device) => void;
}

export const LoginHistorySection: React.FC<LoginHistorySectionProps> = React.memo((props: LoginHistorySectionProps) => {
  const { history, devices, logoutDevice, removeDevice } = props;

  return (
    <Card>
      <CardHeader size="small" title="Recognized devices"  />
      <Stack spacing={1}>
        {devices.map(({ TypeIcon, device, ubication, active, last }, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1}>
            <Icon path={TypeIcon} size={1} />
            <Typography variant="body1" flexGrow={1}>
              {device} <Typography variant="caption">| {ubication}</Typography>
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
            <IconButton aria-label="close" size="small" sx={{ float: 'right' }} onClick={() => removeDevice(devices[i])}>
              <Icon path={mdiClose} size={1} />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <CardHeader size="small" title="Active Sessions" sx={{ mt: 6 }} />
      <Stack spacing={1}>
        {devices.map(({ TypeIcon, device, ubication }, i) => (
          <Stack key={i} direction="row" alignItems="center" spacing={1}>
            <Icon path={TypeIcon} size={1} color="success" />
            <Typography variant="body1" flexGrow={1}>
              {device} <Typography variant="caption">| {ubication}</Typography>
            </Typography>
            <Button variant="text" color="error" onClick={() => logoutDevice(devices[i])}>
							Logout
            </Button>
          </Stack>
        ))}
      </Stack>

      <CardHeader title="Login history" subtitle="Your recent login activity" sx={{ mt: 6 }}/>
      <TableContainer>
        <Table size="small" aria-label="results table">
          <TableHead>
            <TableRow>
              <TableCell>Login Type</TableCell>
              <TableCell align="left">Ip Address</TableCell>
              <TableCell align="left">Client</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((row, i) => (
              <TableRow hover key={i}>
                <TableCell>
                  <Typography variant="subtitle2">Credential login</Typography>
                  {row.time}
                </TableCell>
                <TableCell align="left">{row.ip} </TableCell>
                <TableCell align="left">{row.client} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});
