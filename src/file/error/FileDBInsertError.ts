import CustomError from '../../infra/error/CustomError';

export class FileDBInsertError extends CustomError {
  constructor() {
    super('파일 정보를 DB에 저장하는 동안 오류가 발생했습니다.');
  }
}
