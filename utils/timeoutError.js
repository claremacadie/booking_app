export default class TimeoutError extends Error {
  constructor(message='It is taking longer than usual, please try again later.') {
    super(message);
    this.name = 'TimeoutError';
  }
}
