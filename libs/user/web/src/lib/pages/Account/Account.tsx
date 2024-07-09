import { EnvContext, deleteRequest, getRequest, postRequest } from '@gym-app/shared/web';
import { CrudContainer, ConfirmationDialog } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import './Account.scss';
import { AccountSettings } from './AccountSettings';
import { ChangeEmailSettingFormType, ChangeEmailSettings } from './ChangeEmailSettings';
import { DeleteAccount } from './DeleteAccount';
import { GeneralSettingFormType, GeneralSettings, IUser } from './GeneralSettings';

type AccountProps = object;

interface AccountState {
  isFormValid: boolean;
  errorMessage: string;
  loading: boolean;
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

export class Account extends React.Component<AccountProps, AccountState> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;

  constructor(props: AccountProps) {
    super(props);

    this.state = {
      loading : false,
      isFormValid: true,
      errorMessage: '',
      dialog: undefined,
      config: {
        publicProfile: true,
      }
    };
  }

  async componentDidMount() {
    await this.loadUser();
  }

  async onSaveProfileInfo(userData: GeneralSettingFormType) {
    try {
      const { id } = this.state.user || { id: '' };
      await postRequest(`user/edit/${id}`, userData);
      await this.loadUser();
    } catch (error) {
      console.error('Error saving profile info\n\n', { userData }, error);
    }
  }

  async onChangeEmail(userData: ChangeEmailSettingFormType) {
    try {
      const { id } = this.state.user || { id: '' };
      await postRequest(`user/update-email/${id}`, userData);
      await this.loadUser();
    } catch (error) {
      console.error('Error changing email\n\n', { userData }, error);
    }
  }

  async onCancelEmailChange({ changeEmailCode }: { changeEmailCode: string }) {
    this.openDialog({
      title: 'Are you sure?',
      message: 'Do you really want to cancel the email change?',
      onConfirm: async () => {
        try {
          const { id } = this.state.user || { id: '' };
          await deleteRequest(`user/change-email/${id}/${encodeURIComponent(changeEmailCode)}`);
          await this.loadUser();
        } catch (error) {
          console.error('Error reverting email change\n\n', { changeEmailCode }, error);
          this.setState({ errorMessage: 'Error reverting email change' });
        }
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
    this.setState({ errorMessage: '' });
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

  async loadUser() {
    try {
      this.setState({ loading: true });
      const { id } = JSON.parse(localStorage.getItem('userData') || '{}');
      const user = await getRequest<IUser>(`/user/${id}`);
      this.setState({ user, loading: false });
    } catch (error) {
      this.setState({ loading: false, errorMessage: 'Error loading user data' });
      console.error('Error loading user data', error);
    }
  }

  render() {
    const { errorMessage, user, config, loading, dialog } = this.state;
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
            errorMessage={errorMessage}
            user={user as IUser}
            onSave={(data) => this.onSaveProfileInfo(data)}
          />

          <ChangeEmailSettings
            errorMessage={errorMessage}
            user={user as IUser}
            onSave={(data) => this.onChangeEmail(data)}
            onCancel={(data) => this.onCancelEmailChange(data)}
          />
          <AccountSettings
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
