import CustomError from '../../infra/error/CustomError';

export class GenderValidationError extends CustomError {
  constructor() {
    super('성별이 입력되어야 합니다.');
  }
}
