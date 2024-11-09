import { ActionStatus, CrudContainer, EnvContext, getStatusesProperty } from '@gym-app/shared/web';
import { IUser } from '@gym-app/user/types';
import Stack from '@mui/material/Stack';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getUser, getUserState, getUserStatus, UserActionTypes, UserRequestStatuses } from '../../reducer';
import { changeEmail, ChangeEmailSettingFormType, changePassword, ChangePasswordFormType, loadUser, saveProfileInfo, uploadUserImage } from '../../reducer/UserActions';
import { ChangeEmailSettings } from './components/ChangeEmailSettings';
import { ChangePasswordSection } from './components/ChangePasswordSection';
import './Account.scss';
import { GeneralSettingFormType, GeneralSettings } from './GeneralSettings';

const subjectStatuses = [UserActionTypes.LoadUser, UserActionTypes.UploadUserImage];

interface AccountProps {
  t: (key: string) => string;
  user?: IUser;
  loading: boolean;
  errorMessage: string;
  statuses: UserRequestStatuses;
  getUserStatusProperty: <Key extends keyof ActionStatus>(property: Key) => ActionStatus[Key] | null;
  loadUser: () => void;
  uploadUserImage: (file: File) => void;
  saveProfileInfo: (userData: Partial<IUser>) => void;
  changePassword: (changePasswordData: ChangePasswordFormType) => void;
  changeEmail: (userData: ChangeEmailSettingFormType) => void;
}

interface AccountState {
  isFormValid: boolean;
  user?: IUser;
}

class AccountClass extends React.Component<AccountProps, AccountState> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;

  constructor(props: AccountProps) {
    super(props);

    this.state = {
      isFormValid: true,
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

  async onChangeEmail(userData: ChangeEmailSettingFormType) {
    this.props.changeEmail(userData);
  }

  async onChangePassword(changePasswordData: ChangePasswordFormType): Promise<void> {
    this.props.changePassword(changePasswordData);
  }

  onCloseError() {
    const { user } = this.state;
    if (!user) {
      return;
    }
  }

  render() {
    const { user, errorMessage, loading, statuses, getUserStatusProperty, t } = this.props;

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
    statuses: getUserState(state as never).statuses,
    getUserStatusProperty: getStatusesProperty(getUserState(state as never).statuses, subjectStatuses),
  }),
  {
    loadUser,
    saveProfileInfo,
    uploadUserImage,
    changePassword,
    changeEmail,
  }
)(withTranslation('user')(AccountClass));
