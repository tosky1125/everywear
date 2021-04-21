import CustomError from '../../infra/error/CustomError';

export class S3UploadError extends CustomError {
  constructor() {
    super('S3파일 업로드 중 오류가 발생했습니다.');
  }
}
