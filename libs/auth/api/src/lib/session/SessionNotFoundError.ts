export class SessionNotFoundError extends Error {
  constructor(message: string, public statusCode = 404) {
    super(message);
    this.name = 'SessionNotFoundError';
  }
}
