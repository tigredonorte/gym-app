
import { CardHeader } from '@gym-app/ui';
import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { IPasswordHistoryItem, IUser } from '../../../reducer';

interface ChangePasswordHistorySectionProps {
  user?: IUser;
  cancelRequest: (row: IPasswordHistoryItem) => void;
}

export const ChangePasswordHistorySection: React.FC<ChangePasswordHistorySectionProps> = React.memo((data: ChangePasswordHistorySectionProps) => {
  const { user, cancelRequest } = data;

  if (!user?.passwordHistory) {
    return null;
  }

  const passwordHistory = user.passwordHistory.map((item, index) => ({ ...item, index })).slice(-5, 5).reverse();

  return (
    <Card>
      <CardHeader title="Password History" subtitle="Password change requests" />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>IP</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { passwordHistory.map((row: IPasswordHistoryItem, i: number) => {
              const expired = new Date(row.expiresAt) < new Date();
              let status = expired ? 'Request expired' : 'Pending Confirmation';
              if (row.confirmed) {
                status = 'Password changed';
              }
              return (
                <TableRow hover key={i}>
                  <TableCell>
                    <Typography variant="subtitle2">{status}</Typography>
                    {new Date(row.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>{new Date(row.expiresAt).toDateString()}</TableCell>
                  <TableCell>{row.ip}</TableCell>
                  <TableCell>
                    {!expired && !row.confirmed && (
                      <IconButton onClick={() => cancelRequest(row)}>
                        <Icon path={mdiClose} size={1} />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});
