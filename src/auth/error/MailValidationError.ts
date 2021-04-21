import CustomError from '../../infra/error/CustomError';

export class MailValidationError extends CustomError {
  constructor() {
    super('메일 주소가 기재되어야 합니다.');
  }
}
