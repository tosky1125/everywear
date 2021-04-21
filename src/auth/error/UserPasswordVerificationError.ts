import CustomError from '../../infra/error/CustomError';

export class UserPasswordVerificationError extends CustomError {
  constructor() {
    super('비밀번호가 일치하지 않습니다.');
  }
}
