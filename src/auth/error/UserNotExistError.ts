import CustomError from '../../infra/error/CustomError';

export class UserNotExistError extends CustomError {
  constructor() {
    super('해당 메일 주소를 가진 유저가 존재하지 않습니다.');
  }
}
