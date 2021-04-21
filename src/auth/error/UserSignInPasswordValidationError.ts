import CustomError from '../../infra/error/CustomError';

export class UserSignInPasswordValidationError extends CustomError {
  constructor() {
    super('메일과 패스워드가 꼭 입력되어야 합니다.');
  }
}
