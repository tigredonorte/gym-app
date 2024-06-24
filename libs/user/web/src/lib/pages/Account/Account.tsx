import { EnvContext } from '@gym-app/shared/web';
import Stack from '@mui/material/Stack';
import React from 'react';
import './Account.scss';
import { AccountSettings } from './AccountSettings';
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

  onSaveProfileInfo(data: GeneralSettingFormType) {
    console.log('Save profile info', { data });
  }

  onChangeSettings(option: string, value: boolean) {
    console.log('Change settings', { option, value });
  }

  onDeleteAccount() {
    console.log('Delete account');
    // const userId = localStorage.getItem('userId');
    // const response = await fetch(`${this.context.backendEndpoint}/user/${userId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });
  }

  loadUser() {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found');
      }
      const data = JSON.parse(userData);
      this.setState({
        user: {
          name: data.name,
          email: data.email,
        }
      });
      console.log('User data loaded', data);
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
