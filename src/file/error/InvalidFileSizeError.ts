import CustomError from '../../infra/error/CustomError';

export class InvalidFileSizeError extends CustomError {
  constructor() {
    super('파일 사이즈가 너무 큽니다.');
  }
}
