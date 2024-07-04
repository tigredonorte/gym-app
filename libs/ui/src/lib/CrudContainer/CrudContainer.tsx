import { mdiAlertCircleOutline, mdiFolderRemoveOutline, mdiLoading } from '@mdi/js';
import { CrudBox } from './CrudBox';

function isEmptyData<T>(data: T): data is NonNullable<T> {
  return Array.isArray(data) ? data.length === 0 : !data;
}

interface CrudContainerProps<T> {
  // Loading state
  loading: boolean
  loadingMessage?: string

  // Empty state
  emptyMessage: string
  EmptyItem?: React.ReactNode

  // Data
  data: T | null | undefined
  children: React.ReactNode

  // Error handling
  errorMessage: string
  ErrorItem?: React.ReactNode
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
}: CrudContainerProps<T>) => {
  if (loading) {
    return <CrudBox text={loadingMessage} icon={mdiLoading} color='info' />;
  }

  if (errorMessage) {
    return (
      <CrudBox icon={mdiAlertCircleOutline} text={errorMessage} color='error'>
        {ErrorItem}
      </CrudBox>
    );
  }

  if (isEmptyData(data)) {
    const color = Array.isArray(data) ? 'info' : 'error';
    return (
      <CrudBox icon={mdiFolderRemoveOutline} text={emptyMessage} color={color}>
        {EmptyItem}
      </CrudBox>
    );
  }

  return children;
};