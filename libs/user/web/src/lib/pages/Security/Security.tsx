import { CrudContainer } from '@gym-app/ui';
import { mdiCellphone, mdiDesktopTower, mdiTablet } from '@mdi/js';
import Stack from '@mui/material/Stack';
import React from 'react';
import { connect } from 'react-redux';
import { getUser, getUserState, IUser, UserStatusses } from '../../reducer';
import { cancelChangePassword, changePassword, ChangePasswordFormType, loadUser } from '../../reducer/UserActions';
import { ChangePasswordHistorySection } from './ChangePasswordHistorySection';
import { ChangePassworSection } from './ChangePasswordSection';
import { Device, HistoryRow, LoginHistorySection } from './LoginHistorySection';

const createData = (time: string, ip: string, client: string): HistoryRow => {
  return { time, ip, client };
};

const history = [
  createData('09:06 AM 05/07/2023', '95.130.17.84', 'Chrome, Mac OS 10.15.7'),
  createData('06:46 AM 05/07/2023', '95.130.17.84', 'Chrome, Mac OS 10.15.7'),
  createData('09:06 AM 06/07/2023', '95.130.17.84', 'Chrome, Mac OS 10.15.7'),
];

const devices: Device[] = [
  {
    TypeIcon: mdiDesktopTower,
    device: 'Cent Desktop',
    ubication: '4351 Deans Lane, Chelmsford',
    active: true,
  },
  {
    TypeIcon: mdiTablet,
    device: 'Imho Tablet ',
    ubication: '4185 Michigan Avenue',
    active: false,
    last: '5 days ago',
  },
  {
    TypeIcon: mdiCellphone,
    device: 'Albs Mobile',
    ubication: '3462 Fairfax Drive, Montcalm',
    active: false,
    last: '1 month ago',
  },
];
interface SecurityProps {
  user?: IUser;
  statusses: UserStatusses;
  loadUser: () => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  cancelChangePassword: () => void;
}

class SecurityClass extends React.Component<SecurityProps> {

  constructor(props: SecurityProps) {
    super(props);
  }

  async componentDidMount() {
    this.props.loadUser();
  }

  async onChangePassword(changePasswordData: ChangePasswordFormType): Promise<void> {
    this.props.changePassword(changePasswordData);
  }

  cancelPasswordRequest(): void {
    this.props.cancelChangePassword();
  }

  logoutDevice = (device: Device) => {
    console.log(device);
  };

  removeDevice = (device: Device) => {
    console.log(device);
  };

  render(): React.ReactNode {
    const { user, statusses } = this.props;

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
            devices={devices}
            history={history}
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
    statusses: getUserState(state as never).statuses,
  }),
  {
    loadUser,
    changePassword,
    cancelChangePassword,
  }
)(SecurityClass);
