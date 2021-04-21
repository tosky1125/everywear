import CustomError from '../../infra/error/CustomError';

export class InvalidFileError extends CustomError {
  constructor() {
    super('파일이 형식에 맞지 않습니다.');
  }
}
