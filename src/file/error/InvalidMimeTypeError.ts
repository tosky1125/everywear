import CustomError from '../../infra/error/CustomError';

export class InvalidMimeTypeError extends CustomError {
  constructor() {
    super('미디어 타입이 맞지 않습니다.');
  }
}
