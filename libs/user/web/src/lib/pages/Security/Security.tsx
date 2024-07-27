import { IPagination } from '@gym-app/shared/web';
import { CrudContainer } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import { connect } from 'react-redux';
import { getAccesses, getDevices, getSessions, getUser, getUserState, IUser, UserStatusses } from '../../reducer';
import { IAccessLog, IDeviceInfo, ISession } from '../../reducer/session.types';
import { cancelChangePassword, changePassword, ChangePasswordFormType, loadUser, loadUserAccesses, loadUserSession } from '../../reducer/UserActions';
import { ActiveDevicesSession } from './components/ActiveDevicesSession';
import { ChangePasswordHistorySection } from './components/ChangePasswordHistorySection';
import { ChangePassworSection } from './components/ChangePasswordSection';
import { LoginHistorySection } from './components/LoginHistorySection';
interface SecurityProps {
  user?: IUser;
  sessions?: ISession[];
  accesses?: IPagination<IAccessLog>;
  devices?: IDeviceInfo[];
  statusses: UserStatusses;
  loadUser: () => void;
  loadUserAccesses: (page: number) => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  cancelChangePassword: () => void;
}

class SecurityClass extends React.Component<SecurityProps> {

  constructor(props: SecurityProps) {
    super(props);
  }

  async componentDidMount() {
    const { user, accesses, loadUser } = this.props;
    !user && loadUser();
    !accesses && this.loadAccessPage(1);
  }

  async onChangePassword(changePasswordData: ChangePasswordFormType): Promise<void> {
    this.props.changePassword(changePasswordData);
  }

  cancelPasswordRequest(): void {
    this.props.cancelChangePassword();
  }

  loadAccessPage(page: number) {
    const { loadUserAccesses } = this.props;
    loadUserAccesses(page);
  }

  render(): React.ReactNode {
    const { user, statusses, accesses, devices } = this.props;

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
          <ActiveDevicesSession devices={devices} />
          <LoginHistorySection
            accesses={accesses}
            loadPage={this.loadAccessPage.bind(this)}
            status={statusses.loadUserAccesses}
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
    loadUserAccesses,
    changePassword,
    cancelChangePassword,
  }
)(SecurityClass);
