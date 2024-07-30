import { IPagination } from '@gym-app/shared/web';
import { ConfirmationDialog, CrudContainer } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import { connect } from 'react-redux';
import { getAccesses, getDevices, getSessions, getUser, getUserState, IUser, UserRequestStatusses } from '../../reducer';
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
  statusses: UserRequestStatusses;
  loadUser: () => void;
  loadUserAccesses: (page: number) => void;
  loadUserSession: () => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  cancelChangePassword: () => void;
}

interface SecurityState {
  dialog?: {
    title: string;
    message: string;
    onConfirm: () => void;
  };
}

class SecurityClass extends React.Component<SecurityProps, SecurityState> {

  state: SecurityState = {
    dialog: undefined,
  };

  constructor(props: SecurityProps) {
    super(props);
  }

  async componentDidMount() {
    const { user, devices, accesses, loadUser, loadUserSession } = this.props;
    !user && loadUser();
    !accesses?.items && this.loadAccessPage(1);
    !devices?.length && loadUserSession();
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

  closeDialog() {
    this.setState({ dialog: undefined });
  }

  logoutDevice(device: IDeviceInfo) {
    const onConfirm = async () => {
      console.log('logoutDevice', device);
      this.closeDialog();
    };

    this.setState({
      dialog: {
        title: 'Logout device',
        message: 'Are you sure you want to logout this device?',
        onConfirm,
      }
    });
  }

  logoutAll(devices: IDeviceInfo[]) {
    const onConfirm = async () => {
      console.log('logoutAll', devices);
      this.closeDialog();
    };

    this.setState({
      dialog: {
        title: 'Logout all devices',
        message: 'Are you sure you want to logout all devices?',
        onConfirm,
      }
    });
  }

  render(): React.ReactNode {
    const { user, statusses, accesses, devices } = this.props;
    const { dialog } = this.state;

    return (
      <>
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
            <ActiveDevicesSession
              devices={devices}
              status={statusses.loadUserSession}
              logoutDevice={this.logoutDevice.bind(this)}
              logoutAll={this.logoutAll.bind(this)}
            />
            <LoginHistorySection
              accesses={accesses}
              loadPage={this.loadAccessPage.bind(this)}
              status={statusses.loadUserAccesses}
            />

          </Stack>
        </CrudContainer>

        <ConfirmationDialog
          open={!!dialog}
          title={dialog?.title || ''}
          message={dialog?.message || ''}
          onConfirm={() => dialog?.onConfirm()}
          onCancel={() => this.closeDialog()}
        />
      </>
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
