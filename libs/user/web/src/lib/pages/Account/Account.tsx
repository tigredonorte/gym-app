import { EnvContext, postRequest } from '@gym-app/shared/web';
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
      isFormValid: true,
      errorMessage: '',
      config: {
        publicProfile: true,
      }
    };
  }

  componentDidMount() {
    this.loadUser();
  }

  async onSaveProfileInfo(userData: GeneralSettingFormType) {
    try {
      const { id } = this.state.user || { id: '' };
      await postRequest(`user/edit/${id}`, userData);
    } catch (error) {
      console.error('Error saving profile info\n\n', { userData }, error);
    }
  }

  async onChangeEmail(userData: ChangeEmailSettingFormType) {
    try {
      const { id } = this.state.user || { id: '' };
      await postRequest(`user/edit-email/${id}`, userData);
    } catch (error) {
      console.error('Error changing email\n\n', { userData }, error);
    }
  }

  onChangeSettings(option: string, value: boolean) {
    console.log('Change settings', { option, value });
  }

  onDeleteAccount() {
    console.log('Delete account');
  }

  loadUser() {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found');
      }
      const user = JSON.parse(userData);
      this.setState({ user });
      console.log('User data loaded', user);
    } catch (error) {
      console.error('Error loading user data', error);
    }
  }

  render() {
    const { isFormValid, errorMessage, user, config } = this.state;

    console.log('User', { user });
    return (
      <Stack spacing={2}>
        {
          user && (
            <GeneralSettings
              isFormValid={isFormValid}
              errorMessage={errorMessage}
              user={user}
              onSave={(data) => this.onSaveProfileInfo(data)}
            />
          )
        }
        {
          user && (
            <ChangeEmailSettings
              isFormValid={isFormValid}
              errorMessage={errorMessage}
              user={user}
              onSave={(data) => this.onChangeEmail(data)}
            />
          )
        }
        <AccountSettings
          onChange={(option: string, value: boolean) => this.onChangeSettings(option, value)}
          config={config}
        />
        <DeleteAccount
          onDelete={() => this.onDeleteAccount()}
        />
      </Stack>
    );
  }
}
