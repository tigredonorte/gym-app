import { getRequest } from '@gym-app/shared/web';
import { ConfirmDialog } from '@gym-app/ui';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Confirm: React.FC = () => {
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

  const confirm = async() => {
    try {
      const { title, message } = await getRequest<{ message: string; title: string; }>(`${url}`);
      setState({
        title,
        message,
        status: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error encountered. Please try again.';
      const title = error instanceof Error && 'title' in error && typeof error.title === 'string' ? error.title : 'Error';
      setState({
        message,
        title,
        status: 'error',
      });
    }
  };

  React.useEffect(() => {
    !url ? navigate('/404') : confirm();
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