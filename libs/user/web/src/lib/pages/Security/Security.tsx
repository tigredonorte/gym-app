import { ConfirmationDialog, CrudContainer, IPagination } from '@gym-app/shared/web';
import { IDeviceInfo, IUser } from '@gym-app/user/types';
import Stack from '@mui/material/Stack';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getSessions, getUser, getUserState, UserRequestStatuses } from '../../reducer';
import { IAccessLog, ISession } from '../../reducer/session.types';
import {
  changeEmail,
  ChangeEmailSettingFormType,
  changePassword,
  ChangePasswordFormType,
  loadUser,
  logoutDevice
} from '../../reducer/UserActions';
import { ChangeEmailSettings } from './components/ChangeEmailSettings';
import { ChangePasswordSection } from './components/ChangePasswordSection';
import { MultiFactorSection } from './components/MultiFactorSection';

interface SecurityPropsActions {
  loadUser: () => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  logoutDevice: (sessionId: string, accessId: string) => void;
  changeEmail: (userData: ChangeEmailSettingFormType) => void;
}

interface ISecurityProps {
  user?: IUser;
  sessions?: ISession[];
  accesses?: IPagination<IAccessLog>;
  devices?: IDeviceInfo[];
  statuses: UserRequestStatuses;
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
    const { user, loadUser } = this.props;
    !user && loadUser();
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

  async onChangePassword(changePasswordData: ChangePasswordFormType): Promise<void> {
    this.props.changePassword(changePasswordData);
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
    const { user, statuses } = this.props;
    const { dialog } = this.state;

    return (
      <>
        <CrudContainer
          loading={statuses.loadUser?.loading || false}
          loadingMessage={this.props.t('Security.loading')}
          errorMessage={statuses.loadUser?.error || ''}
          emptyMessage={this.props.t('Security.notFound')}
          data={user}
        >
          <Stack spacing={2}>
            <ChangeEmailSettings
              errorMessage={statuses.changeEmail?.error || ''}
              loading={statuses.changeEmail?.loading || false}
              user={user as IUser}
              onSave={(data) => this.onChangeEmail(data)}
            />
            <ChangePasswordSection
              loading={statuses?.changePassword?.loading || false}
              error={statuses?.changePassword?.error || ''}
              onSave={this.onChangePassword.bind(this)} user={user as IUser}
            />
            <MultiFactorSection />
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
    statuses: getUserState(state as never).statuses,
  } as ISecurityProps),
  {
    loadUser,
    changePassword,
    logoutDevice,
    changeEmail,
  } as SecurityPropsActions
)(withTranslation('user')(SecurityClass));
