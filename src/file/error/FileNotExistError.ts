import CustomError from '../../infra/error/CustomError';

export class FileNotExistError extends CustomError {
  constructor() {
    super('파일이 존재하지 않습니다.');
  }
}
