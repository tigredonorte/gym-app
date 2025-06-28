import { UserLocaleType } from './en';

export const ptBr: UserLocaleType = {
  account: {
    container: {
      loading: 'Carregando dados do usuário',
      empty: 'Usuário não encontrado',
    },
    cancelEmailChange: {
      title: 'Você tem certeza?',
      message: 'Você realmente deseja cancelar a alteração de e-mail?',
    },
  },
  deleteAccount: {
    confirm: {
      title: 'Deletar Conta',
      message: 'Você tem certeza que deseja deletar sua conta?',
    },
  },
  GeneralSettings: {
    title: 'Configurações Gerais',
    imageTitle: 'Foto de Perfil',
    imageLimit: 'O limite de tamanho da imagem deve ser no máximo 125kb.',
    changeImage: 'Alterar Imagem',
    userAvatar: 'Avatar do Usuário',
    save: 'Salvar',
  },
  DeleteAccount: {
    title: 'Excluir Conta',
    warning: 'Uma vez que você exclua sua conta, não há como voltar atrás. Por favor, tenha certeza.',
  },
  ChangeEmailSetting: {
    title: 'Alterar E-mail',
    pendingRequest: 'Você tem uma solicitação de alteração de e-mail pendente. Acesse seu e-mail para confirmar a alteração.',
    oneRequestLimit: 'Apenas uma solicitação de alteração de e-mail pode estar pendente por vez',
    unchangedEmail: 'E-mail inalterado',
  },
  NotificationSettings: {
    title: 'Notificações',
    alert: 'Alerta!',
    nonDisableNotice: 'Notificações transacionais não podem ser desativadas',
    allowTransactional: 'Permitir notificações transacionais',
    receiveNotifications: 'Receber notificações sobre atividades da conta e atualizações importantes',
  },
  Confirm: {
    error: 'Erro encontrado. Por favor, tente novamente.',
    title: 'Erro',
  },
  Logout: {
    message: 'Saindo...',
  },
  ActiveDevicesSession: {
    loading: 'Carregando dispositivos do usuário',
    noDevices: 'Nenhum dispositivo encontrado',
    title: 'Dispositivos Ativos',
    userDevices: 'Seus dispositivos ativos',
    logoutAll: 'Sair de todos',
    currentActive: 'Ativo Atual',
    active: 'Ativo',
    lastActive: 'Última Atividade',
  },
  ChangePasswordHistorySection: {
    title: 'Histórico de Senhas',
    requests: 'Solicitações de alteração de senha',
    createdAt: 'Criado em',
    expiration: 'Expiração',
    ip: 'IP',
    expired: 'Solicitação expirada',
    pending: 'Confirmação Pendente',
    changed: 'Senha alterada',
  },
  ChangePasswordSection: {
    title: 'Alterar senha',
    pendingRequest: 'Você tem uma solicitação de alteração de senha pendente. Acesse seu e-mail para confirmar a alteração.',
    loading: 'Carregando sessões do usuário',
    noSessions: 'Nenhuma sessão encontrada',
    changePassword: 'Alterar Senha',
    updateSecurity: 'Atualizar Segurança do Perfil',
    currentPassword: 'Senha Atual',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Senha',
  },
  DeviceActionButton: {
    currentDevice: 'Este é o seu dispositivo atual. Você não pode sair do dispositivo atual.',
    close: 'fechar',
  },
  LoginHistorySection: {
    loading: 'Carregando sessões do usuário',
    noSessions: 'Nenhuma sessão encontrada',
    title: 'Histórico de Login',
    recentActivity: 'Sua atividade de login recente',
    resultsTable: 'tabela de resultados',
    loginDate: 'Data de Login',
    ipAddress: 'Endereço IP',
    client: 'Cliente',
    sessionDuration: 'Duração da sessão',
    unknownClient: 'Cliente Desconhecido',
    unknownLocation: 'Localização Desconhecida',
  },
  MultiFactorSection: {
    title: 'Autenticação Multifator',
    off: 'Desligado',
    app: 'Aplicativo Autenticador',
    appDescription: 'Use um aplicativo autenticador para gerar códigos de segurança de uso único.',
    setUp: 'Configurar',
    sms: 'Mensagem de Texto',
    smsDescription: 'Use seu telefone celular para receber códigos de segurança via SMS.',
  },
  PendingChangeConfirmation: {
    cancel: 'Cancelar Alteração',
  },
  Security: {
    logoutDevice: 'Sair do dispositivo',
    confirmLogoutDevice: 'Você tem certeza que deseja sair deste dispositivo?',
    logoutAllDevices: 'Sair de todos os dispositivos',
    confirmLogoutAll: 'Você tem certeza que deseja sair de todos os dispositivos?',
    loading: 'Carregando dados do usuário',
    notFound: 'Usuário não encontrado',
  },
};

if (import.meta.hot) {
  import.meta.hot.accept();
}
