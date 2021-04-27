import CustomError from '../../infra/error/CustomError';

export class SignUpUserExistError extends CustomError {
  constructor() {
    super('해당 메일 주소로 유저가 존재합니다.');
  }
}
