import { ActionStatus, EnvContext } from '@gym-app/shared/web';
import { CrudContainer } from '@gym-app/ui';
import Stack from '@mui/material/Stack';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getUser, getUserStatus, IUser, UserActionTypes } from '../../reducer';
import { loadUser, saveProfileInfo } from '../../reducer/UserActions';
import './Account.scss';
import { DeleteAccount } from './DeleteAccount';
import { GeneralSettingFormType, GeneralSettings } from './GeneralSettings';
import { NotificationSettings } from './NotificationSettings';

interface AccountProps {
  t: (key: string) => string;
  user?: IUser;
  loading: boolean;
  errorMessage: string;
  getUserStatusProperty: <Key extends keyof ActionStatus>(property: Key) => ActionStatus[Key] | null;
  loadUser: () => void;
  saveProfileInfo: (userData: Partial<IUser>) => void;
}

interface AccountState {
  isFormValid: boolean;
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

  render() {
    const { config } = this.state;
    const { user, errorMessage, loading, getUserStatusProperty, t } = this.props;

    return (
      <CrudContainer
        loading={loading}
        loadingMessage={t('account.container.loading')}
        errorMessage={errorMessage}
        emptyMessage={t('account.container.empty')}
        data={user}
      >
        <Stack spacing={2}>
          <GeneralSettings
            errorMessage={getUserStatusProperty('error') || ''}
            loading={getUserStatusProperty('loading') || false}
            user={user as IUser}
            onSave={(data) => this.onSaveProfileInfo(data)}
          />
          <NotificationSettings
            onChange={(option: string, value: boolean) => this.onChangeSettings(option, value)}
            config={config}
          />
          <DeleteAccount
            onDelete={() => this.onDeleteAccount()}
          />
        </Stack>
      </CrudContainer>
    );
  }
}

export const Account = connect(
  (state) => ({
    user: getUser(state as never),
    loading: getUserStatus(state as never, UserActionTypes.LoadUser)?.loading || false,
    errorMessage: getUserStatus(state as never, UserActionTypes.LoadUser)?.error || '',
  }),
  {
    loadUser,
    saveProfileInfo,
  }
)(withTranslation('user')(AccountClass));
