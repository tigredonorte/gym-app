import { mdiAlertCircleOutline, mdiFolderRemoveOutline, mdiLoading } from '@mdi/js';
import { CrudBox } from './CrudBox';
import React from 'react';

function isEmptyData<T>(data: T): data is NonNullable<T> {
  return Array.isArray(data) ? data.length === 0 : !data;
}

interface CrudContainerProps<T> {
  // Loading state
  loading: boolean
  loadingMessage?: string

  // Empty state
  emptyMessage?: string
  EmptyItem?: React.ReactNode

  // Data
  data: T | null | undefined
  children: React.ReactNode

  // Error handling
  errorMessage: string
  ErrorItem?: React.ReactNode

  Header?: React.ReactNode
  Container?: React.FC<{ children: React.ReactNode }>
}

export const CrudContainer = <T,>({
  loading,
  loadingMessage,
  errorMessage,
  emptyMessage,
  EmptyItem,
  ErrorItem,
  data,
  children,
  Header,
  Container = ({ children }: { children: React.ReactNode }) => <>{children}</>,
}: CrudContainerProps<T>) => {
  if (loading) {
    return (
      <Container>
        {Header}
        <CrudBox text={loadingMessage} icon={mdiLoading} color='info' />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container>
        {Header}
        <CrudBox icon={mdiAlertCircleOutline} text={errorMessage} color='error'>
          {ErrorItem}
        </CrudBox>
      </Container>
    );
  }

  if (emptyMessage && isEmptyData(data)) {
    return (
      <Container>
        {Header}
        <CrudBox icon={mdiFolderRemoveOutline} text={emptyMessage} color={'info'}>
          {EmptyItem}
        </CrudBox>
      </Container>
    );
  }

  return (
    <Container>
      {Header}
      {children}
    </Container>
  );
};