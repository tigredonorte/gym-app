export const en = {
  account: {
    container: {
      loading: 'Loading user data',
      empty: 'User not found',
    },
    cancelEmailChange: {
      title: 'Are you sure?',
      message: 'Do you really want to cancel the email change?',
    },
  },
  deleteAccount: {
    confirm: {
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account?',
    },
  },
  GeneralSettings: {
    title: 'General Settings',
    imageLimit: 'Image size Limit should be 125kb Max.',
    changeImage: 'Change Image',
    userAvatar: 'User Avatar',
    save: 'Save',
  },
  DeleteAccount: {
    title: 'Delete Account',
    warning: 'Once you delete your account, there is no going back. Please be certain.',
  },
  ChangeEmailSetting: {
    title: 'Change Email',
    pendingRequest: 'You have a pending email change request. Access your email to confirm the change.',
    oneRequestLimit: 'Only one email change request can be pending at a time',
    unchangedEmail: 'Unchanged email',
  },
  NotificationSettings: {
    title: 'Notifications',
    alert: 'Alert!',
    nonDisableNotice: 'Transactional notifications cannot be disabled',
    allowTransactional: 'Allow transactional notifications',
    receiveNotifications: 'Receive notifications about account activity and important updates',
  },
  Confirm: {
    error: 'Error encountered. Please try again.',
    title: 'Error',
  },
  Logout: {
    message: 'Logging out...',
  },
  ActiveDevicesSession: {
    loading: 'Loading user devices',
    noDevices: 'No devices found',
    title: 'Active Devices',
    userDevices: 'Your active devices',
    logoutAll: 'Logout all',
    currentActive: 'Current Active',
    active: 'Active',
    lastActive: 'Last Active',
  },
  ChangePasswordHistorySection: {
    title: 'Password History',
    requests: 'Password change requests',
    createdAt: 'Created At',
    expiration: 'Expiration',
    ip: 'IP',
    expired: 'Request expired',
    pending: 'Pending Confirmation',
    changed: 'Password changed',
  },
  ChangePasswordSection: {
    title: 'Change password',
    pendingRequest: 'You have a pending password change request. Access your email to confirm the change.',
    loading: 'Loading user sessions',
    noSessions: 'No sessions found',
    changePassword: 'Change Password',
    updateSecurity: 'Update Profile Security',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
  },
  DeviceActionButton: {
    currentDevice: 'This is your current device. You cannot log out from the current device.',
    close: 'close',
  },
  LoginHistorySection: {
    loading: 'Loading user sessions',
    noSessions: 'No sessions found',
    title: 'Login history',
    recentActivity: 'Your recent login activity',
    resultsTable: 'results table',
    loginDate: 'Login Date',
    ipAddress: 'Ip Address',
    client: 'Client',
    sessionDuration: 'Session duration',
    unknownClient: 'Unknown Client',
    unknownLocation: 'Unknown Location',
  },
  MultiFactorSection: {
    title: 'Multi Factor Authentication',
    off: 'Off',
    app: 'Authenticator App',
    appDescription: 'Use an authenticator app to generate one-time security codes.',
    setUp: 'Set Up',
    sms: 'Text Message',
    smsDescription: 'Use your mobile phone to receive security codes via SMS.',
  },
  PendingChangeConfirmation: {
    cancel: 'Cancel Change',
  },
  Security: {
    logoutDevice: 'Logout device',
    confirmLogoutDevice: 'Are you sure you want to logout this device?',
    logoutAllDevices: 'Logout all devices',
    confirmLogoutAll: 'Are you sure you want to logout all devices?',
    loading: 'Loading user data',
    notFound: 'User not found',
  },
};

export type UserLocaleType = typeof en;
