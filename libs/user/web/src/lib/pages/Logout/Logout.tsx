import { CrudContainer } from '@gym-app/ui';
import React from 'react';
import { connect } from 'react-redux';
import { getUserState, UserRequestStatusses } from '../../reducer';
import { logoutUser } from '../../reducer/UserActions';
import { AuthContext } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface LogoutProps {
  logoutUser: (sessionId: string, accessId: string) => Promise<void>;
  logoutStatus: UserRequestStatusses['logout'];
}

const LogoutFn: React.FC<LogoutProps> = ({ logoutUser, logoutStatus }: LogoutProps) => {
  const context = React.useContext(AuthContext);

  React.useEffect(() => {
    context?.logout(logoutUser);
  }, [logoutUser]);

  React.useEffect(() => {
    if (!logoutStatus || logoutStatus.loading) {
      return;
    }

    const time = logoutStatus.error ? 5000 : 0;
    const timer = setTimeout(() => {
      timer && clearTimeout(timer);
      context?.logout();
    }, time);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [logoutStatus]);

  if (!context?.isAuthenticated) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <CrudContainer
      loading={logoutStatus?.loading || false}
      loadingMessage="Logging out..."
      errorMessage={logoutStatus?.error || ''}
      data={{ notEmpty: [] }}
    >
      <></>
    </CrudContainer>
  );
};

export const Logout = connect(
  (state) => ({
    logoutStatus: getUserState(state as never).statuses?.logout,
  }),
  {
    logoutUser,
  }
)(LogoutFn);