import CustomError from '../../infra/error/CustomError';

export class FileStreamError extends CustomError {
  constructor() {
    super('파일 수정 도중 오류가 발생했습니다.');
  }
}
