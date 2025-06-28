import { IUser } from '@gym-app/user/types';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getUser } from '../../reducer';
import { loadUser } from '../../reducer/UserActions';
import { AccountMenu } from './AccountMenu';

interface ConnectedAccountProps {
  user?: IUser;
  loadUser: () => void;
}

const ConnectedAccountComponent: React.FC<ConnectedAccountProps> = ({ user, loadUser }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AccountMenu
      userName={user?.name}
      userEmail={user?.email}
      userProfileImage={user?.userAvatar}
    />
  );
};

export const ConnectedAccount = connect(
  (state) => ({
    user: getUser(state as never),
  }),
  {
    loadUser,
  }
)(withTranslation('user')(ConnectedAccountComponent));
