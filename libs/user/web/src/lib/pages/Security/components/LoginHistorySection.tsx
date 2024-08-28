import { IPagination } from '@gym-app/shared/web';
import { CardHeader, CrudContainer } from '@gym-app/ui';
import { Pagination } from '@mui/material';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { formatDistance } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionStatus } from '../../../reducer';
import { IAccessLog } from '../../../reducer/session.types';

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

interface LoginHistorySectionProps {
  accesses: IPagination<IAccessLog> | undefined;
  status: ActionStatus | undefined;
  loadPage: (page: number) => void;
}
export const LoginHistorySection: React.FC<LoginHistorySectionProps> = React.memo((props: LoginHistorySectionProps) => {
  const { accesses, loadPage, status } = props;
  const currentPage = accesses?.currentPage || 1;
  const paginatedData = accesses?.items;
  const { t } = useTranslation('user');

  return (
    <CrudContainer
      loading={status?.loading || false}
      loadingMessage={t('LoginHistorySection.loading')}
      errorMessage={status?.error || ''}
      emptyMessage={t('LoginHistorySection.noSessions')}
      data={accesses}
      Header={<CardHeader title={t('LoginHistorySection.title')} subtitle={t('LoginHistorySection.recentActivity')}/>}
      Container={Card}
    >
      <TableContainer>
        <Table size="small" aria-label={t('LoginHistorySection.resultsTable')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('LoginHistorySection.loginDate')}</TableCell>
              <TableCell align="left">{t('LoginHistorySection.ipAddress')}</TableCell>
              <TableCell align="left">{t('LoginHistorySection.client')}</TableCell>
              <TableCell align="left">{t('LoginHistorySection.sessionDuration')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((row, i) => (
              <TableRow hover key={i}>
                <TableCell>
                  <Typography variant="subtitle2">{row.client || t('LoginHistorySection.unknownClient')}</Typography>
                  {new Date(row.createdAt).toLocaleString()}
                </TableCell>
                <TableCell align="left">{row.ip}</TableCell>
                <TableCell align="left">
                  {row.location ? `${row.location.city}, ${row.location.region}, ${row.location.country}` : t('LoginHistorySection.unknownLocation')}
                </TableCell>
                <TableCell align="left">
                  {formatDistance(new Date(row.createdAt), new Date(row.logoutDate ? row.logoutDate : new Date()))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
        count={accesses?.totalPages || 1}
        page={currentPage}
        onChange={(_, page) => loadPage(page)}
        color="primary"
      />
    </CrudContainer>
  );
});
