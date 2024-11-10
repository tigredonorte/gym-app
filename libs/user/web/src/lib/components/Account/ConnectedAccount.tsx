import { IUser } from '@gym-app/user/types';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getUser } from '../../reducer';
import { loadUser } from '../../reducer/UserActions';
import { Account } from './Account';

interface ConnectedAccountProps {
  user?: IUser;
  loadUser: () => void;
}

const ConnectedAccountComponent: React.FC<ConnectedAccountProps> = ({ user, loadUser }) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (!user) {
    return (
      <Account
        userName={''}
        userEmail={''}
        userProfileImage={''}
      />
    );
  }

  const { name, email, userAvatar } = user;

  return (
    <Account
      userName={name}
      userEmail={email}
      userProfileImage={userAvatar}
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
