import CustomError from '../../infra/error/CustomError';

export class PointRangeError extends CustomError {
  constructor() {
    super('항목별 점수는 5 이하의 양수이어야만 합니다.');
  }
}
