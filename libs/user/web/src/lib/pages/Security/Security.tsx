import { CrudContainer } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import { connect } from 'react-redux';
import { getAccesses, getDevices, getSessions, getUser, getUserState, IUser, UserStatusses } from '../../reducer';
import { IAccessLog, IDeviceInfo, ISession } from '../../reducer/session.types';
import { cancelChangePassword, changePassword, ChangePasswordFormType, loadUser, loadUserSession } from '../../reducer/UserActions';
import { ChangePasswordHistorySection } from './ChangePasswordHistorySection';
import { ChangePassworSection } from './ChangePasswordSection';
import { LoginHistorySection } from './LoginHistorySection';
interface SecurityProps {
  user?: IUser;
  sessions?: ISession[];
  accesses?: IAccessLog[];
  devices?: IDeviceInfo[];
  statusses: UserStatusses;
  loadUser: () => void;
  loadUserSession: () => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  cancelChangePassword: () => void;
}

class SecurityClass extends React.Component<SecurityProps> {

  constructor(props: SecurityProps) {
    super(props);
  }

  async componentDidMount() {
    const { user, sessions, loadUser, loadUserSession } = this.props;
    !user && loadUser();
    !sessions && loadUserSession();
  }

  async onChangePassword(changePasswordData: ChangePasswordFormType): Promise<void> {
    this.props.changePassword(changePasswordData);
  }

  cancelPasswordRequest(): void {
    this.props.cancelChangePassword();
  }

  logoutDevice = (device: IDeviceInfo) => {
    console.log(device);
  };

  removeDevice = (device: IDeviceInfo) => {
    console.log(device);
  };

  render(): React.ReactNode {
    const { user, statusses, sessions, accesses, devices } = this.props;

    return (
      <CrudContainer
        loading={statusses.loadUser?.loading || false}
        loadingMessage="Loading user data"
        errorMessage={statusses.loadUser?.error || ''}
        emptyMessage="User not found"
        data={user}
      >
        <Stack spacing={2}>
          <ChangePassworSection
            loading={statusses?.changePassword?.loading || false}
            error={statusses?.changePassword?.error || ''}
            onSave={this.onChangePassword.bind(this)} user={user as IUser}
            onCancel={this.cancelPasswordRequest.bind(this)}
          />
          <ChangePasswordHistorySection user={user as IUser} cancelRequest={this.cancelPasswordRequest.bind(this)}/>
          <LoginHistorySection
            sessions={sessions}
            accesses={accesses}
            devices={devices}
            logoutDevice={this.logoutDevice.bind(this)}
            removeDevice={this.removeDevice.bind(this)}
          />
        </Stack>
      </CrudContainer>
    );
  }
}

export const Security = connect(
  (state) => ({
    user: getUser(state as never),
    sessions: getSessions(state as never),
    accesses: getAccesses(state as never),
    devices: getDevices(state as never),
    statusses: getUserState(state as never).statuses,
  }),
  {
    loadUser,
    loadUserSession,
    changePassword,
    cancelChangePassword,
  }
)(SecurityClass);
