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
import { useTranslation } from 'react-i18next';
import { IPasswordHistoryItem, IUser } from '../../../reducer';

interface ChangePasswordHistorySectionProps {
  user: IUser | undefined;
  cancelRequest: (row: IPasswordHistoryItem) => void;
}

export const ChangePasswordHistorySection: React.FC<ChangePasswordHistorySectionProps> = React.memo((data: ChangePasswordHistorySectionProps) => {
  const { user, cancelRequest } = data;
  const { t } = useTranslation('user');

  if (!user?.passwordHistory) {
    return null;
  }

  const passwordHistory = user.passwordHistory.map((item, index) => ({ ...item, index })).slice(-5, 5).reverse();

  return (
    <Card>
      <CardHeader
        title={t('ChangePasswordHistorySection.title')}
        subtitle={t('ChangePasswordHistorySection.requests')}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('ChangePasswordHistorySection.createdAt')}</TableCell>
              <TableCell>{t('ChangePasswordHistorySection.expiration')}</TableCell>
              <TableCell>{t('ChangePasswordHistorySection.ip')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passwordHistory.map((row: IPasswordHistoryItem, i: number) => {
              const expired = new Date(row.expiresAt) < new Date();
              let status = expired ? t('ChangePasswordHistorySection.expired') : t('ChangePasswordHistorySection.pending');
              if (row.confirmed) {
                status = t('ChangePasswordHistorySection.changed');
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
