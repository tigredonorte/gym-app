import { EnvContext } from '@gym-app/shared/web';
import { ConfirmationDialog, CrudContainer } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import { connect } from 'react-redux';
import { getUser, getUserState, getUserStatus, IUser, UserStatusses } from '../../reducer';
import { cancelChangeEmail, changeEmail, ChangeEmailSettingFormType, loadUser, saveProfileInfo } from '../../reducer/UserActions';
import './Account.scss';
import { ChangeEmailSettings } from './ChangeEmailSettings';
import { DeleteAccount } from './DeleteAccount';
import { GeneralSettingFormType, GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';

interface AccountProps {
  user?: IUser;
  loading: boolean;
  errorMessage: string;
  statusses: UserStatusses;
  loadUser: () => void;
  saveProfileInfo: (userData: Partial<IUser>) => void;
  changeEmail: (userData: ChangeEmailSettingFormType) => void;
  cancelChangeEmail: (changeEmailCode: string) => void;
}

interface AccountState {
  isFormValid: boolean;
  dialog?: {
    title: string;
    message: string;
    onConfirm: () => void;
  };
  user?: IUser;
  config: {
    publicProfile: boolean;
  };
}

class AccountClass extends React.Component<AccountProps, AccountState> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;

  constructor(props: AccountProps) {
    super(props);

    this.state = {
      isFormValid: true,
      dialog: undefined,
      config: {
        publicProfile: true,
      }
    };
  }

  async componentDidMount() {
    const { user, loadUser } = this.props;
    !user && loadUser();
  }

  async onSaveProfileInfo(userData: GeneralSettingFormType) {
    this.props.saveProfileInfo(userData);
  }

  async onChangeEmail(userData: ChangeEmailSettingFormType) {
    this.props.changeEmail(userData);
  }

  async onCancelEmailChange({ changeEmailCode }: { changeEmailCode: string }) {
    this.openDialog({
      title: 'Are you sure?',
      message: 'Do you really want to cancel the email change?',
      onConfirm: async () => {
        this.props.cancelChangeEmail(changeEmailCode);
      },
    });
  }

  onChangeSettings(option: string, value: boolean) {
    console.log('Change settings', { option, value });
  }

  onDeleteAccount() {
    console.log('Delete account');
  }

  onCloseError() {
    const { user } = this.state;
    if (!user) {
      return;
    }
  }

  openDialog(dialog: AccountState['dialog']) {
    this.setState({ dialog });
  }

  closeDialog() {
    this.setState({ dialog: undefined });
  }

  async onConfirm() {
    const { dialog } = this.state;
    if (!dialog) {
      return;
    }
    await dialog.onConfirm();
    this.closeDialog();
  }

  render() {
    const { config, dialog } = this.state;
    const { user, errorMessage, loading, statusses } = this.props;

    return (
      <CrudContainer
        loading={loading}
        loadingMessage="Loading user data"
        errorMessage={errorMessage}
        emptyMessage="User not found"
        data={user}
      >
        <Stack spacing={2}>
          <GeneralSettings
            errorMessage={statusses.loadUser?.error || ''}
            loading={statusses.loadUser?.loading || false}
            user={user as IUser}
            onSave={(data) => this.onSaveProfileInfo(data)}
          />

          <ChangeEmailSettings
            errorMessage={statusses.changeEmail?.error || statusses.removeFromEmailHistory?.error || ''}
            loading={statusses.changeEmail?.loading || statusses.removeFromEmailHistory?.loading || false}
            user={user as IUser}
            onSave={(data) => this.onChangeEmail(data)}
            onCancel={(data) => this.onCancelEmailChange(data)}
          />
          <NotificationSettings
            onChange={(option: string, value: boolean) => this.onChangeSettings(option, value)}
            config={config}
          />
          <DeleteAccount
            onDelete={() => this.onDeleteAccount()}
          />
          <ConfirmationDialog
            open={!!dialog}
            title={dialog?.title || ''}
            message={dialog?.message || ''}
            onConfirm={() => this.onConfirm()}
            onCancel={() => this.closeDialog()}
          />
        </Stack>
      </CrudContainer>
    );
  }
}

export const Account = connect(
  (state) => ({
    user: getUser(state as never),
    loading: getUserStatus(state as never, 'loadUser')?.loading || false,
    errorMessage: getUserStatus(state as never, 'loadUser')?.error || '',
    statusses: getUserState(state as never).statuses,
  }),
  {
    loadUser,
    saveProfileInfo,
    changeEmail,
    cancelChangeEmail,
  }
)(AccountClass);
