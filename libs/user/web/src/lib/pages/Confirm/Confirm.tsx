import { getRequest } from '@gym-app/shared/web';
import { ConfirmDialog } from '@gym-app/shared/web';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Confirm: React.FC = () => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();
  const [state, setState] = React.useState<{
    message: string;
    status: 'success' | 'error' | 'warning' | 'info';
    title: string;
  } | null>(null);
  const location = useLocation();
  const getQueryParams = (search: string) => {
    const params = new URLSearchParams(search);
    const queryParams: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      queryParams[key] = value;
    }
    return queryParams;
  };
  const { url, redirect } = getQueryParams(location.search);
  const isFetchedRef = React.useRef(false);

  const confirm = async(url: string) => {
    try {
      const { title, message } = await getRequest<{ message: string; title: string; }>(`${url}`);
      setState({
        title: t(title),
        message: t(message),
        status: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t('Error encountered. Please try again.');
      const title = error instanceof Error && 'title' in error && typeof error.title === 'string' ? t(error.title) : t('Error');
      setState({
        message,
        title,
        status: 'error',
      });
    }
  };

  React.useEffect(() => {
    if (isFetchedRef.current) {
      return;
    }
    isFetchedRef.current = true;
    !url ? navigate('/404') : confirm(url);
  }, []);

  if (!state) {
    return null;
  }

  return (
    <ConfirmDialog
      {...state}
      open={true}
      onConfirm={() => navigate(redirect || '/')}
    />
  );
};