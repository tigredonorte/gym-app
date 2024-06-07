export class SessionAlreadyLoggedOut extends Error {
  constructor(message: string, public statusCode = 409) {
    super(message);
    this.name = 'SessionAlreadyLoggedOut';
  }
}
