import { IPagination } from '@gym-app/shared/web';
import { ConfirmationDialog, CrudContainer } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getAccesses, getDevices, getSessions, getUser, getUserState, IUser, UserRequestStatusses } from '../../reducer';
import { IAccessLog, IDeviceInfo, ISession } from '../../reducer/session.types';
import {
  cancelChangeEmail,
  cancelChangePassword,
  changeEmail,
  ChangeEmailSettingFormType,
  changePassword,
  ChangePasswordFormType,
  loadUser,
  loadUserAccesses,
  loadUserSession,
  logoutDevice,
} from '../../reducer/UserActions';
import { ActiveDevicesSession } from './components/ActiveDevicesSession';
import { ChangePasswordHistorySection } from './components/ChangePasswordHistorySection';
import { ChangePassworSection } from './components/ChangePasswordSection';
import { LoginHistorySection } from './components/LoginHistorySection';
import { ChangeEmailSettings } from './components/ChangeEmailSettings';

interface SecurityPropsActions {
  loadUser: () => void;
  loadUserAccesses: (page: number) => void;
  loadUserSession: () => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  cancelChangePassword: () => void;
  logoutDevice: (sessionId: string, accessId: string) => void;
  changeEmail: (userData: ChangeEmailSettingFormType) => void;
  cancelChangeEmail: (changeEmailCode: string) => void;
}

interface ISecurityProps {
  user?: IUser;
  sessions?: ISession[];
  accesses?: IPagination<IAccessLog>;
  devices?: IDeviceInfo[];
  statusses: UserRequestStatusses;
}

interface SecurityProps extends SecurityPropsActions, ISecurityProps, WithTranslation {}

interface IDialog {
  title: string;
  message: string;
  onConfirm: () => void;
}
interface SecurityState {
  dialog?: IDialog;
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

  openDialog(dialog: IDialog) {
    this.setState({ dialog });
  }

  closeDialog() {
    this.setState({ dialog: undefined });
  }

  async onChangeEmail(userData: ChangeEmailSettingFormType) {
    this.props.changeEmail(userData);
  }

  async onCancelEmailChange({ changeEmailCode }: { changeEmailCode: string }) {
    const { t } = this.props;
    this.openDialog({
      title: t('account.cancelEmailChange.title'),
      message: t('account.cancelEmailChange.message'),
      onConfirm: async () => {
        await this.props.cancelChangeEmail(changeEmailCode);
        this.closeDialog();
      },
    });
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

  logoutDevice(device: IDeviceInfo) {
    const { logoutDevice } = this.props;
    const onConfirm = async () => {
      logoutDevice(device.sessionId, device.accessId);
      this.closeDialog();
    };

    this.openDialog({
      title: this.props.t('Security.logoutDevice'),
      message: this.props.t('Security.confirmLogoutDevice'),
      onConfirm,
    });
  }

  logoutAll(devices: IDeviceInfo[]) {
    const onConfirm = async () => {
      console.log('logoutAll', devices);
      this.closeDialog();
    };

    this.openDialog({
      title: this.props.t('Security.logoutAllDevices'),
      message: this.props.t('Security.confirmAllLogoutDevices'),
      onConfirm,
    });
  }

  render(): React.ReactNode {
    const { user, statusses, accesses, devices } = this.props;
    const { dialog } = this.state;

    return (
      <>
        <CrudContainer
          loading={statusses.loadUser?.loading || false}
          loadingMessage={this.props.t('Security.loading')}
          errorMessage={statusses.loadUser?.error || ''}
          emptyMessage={this.props.t('Security.notFound')}
          data={user}
        >
          <Stack spacing={2}>
            <ChangeEmailSettings
              errorMessage={statusses.changeEmail?.error || statusses.removeFromEmailHistory?.error || ''}
              loading={statusses.changeEmail?.loading || statusses.removeFromEmailHistory?.loading || false}
              user={user as IUser}
              onSave={(data) => this.onChangeEmail(data)}
              onCancel={(data) => this.onCancelEmailChange(data)}
            />
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
  } as ISecurityProps),
  {
    loadUser,
    loadUserSession,
    loadUserAccesses,
    changePassword,
    cancelChangePassword,
    logoutDevice,
    changeEmail,
    cancelChangeEmail,
  } as SecurityPropsActions
)(withTranslation('user')(SecurityClass));
