import { EvaluationRequest } from '../domain/EvaluationRequest';

export class EvaluationMapper {
  static execute(rows) {
    return new EvaluationRequest(rows.userId,
      rows.imgUrl,
      rows.purpose,
      rows.isEvaluated,
      rows.trend,
      rows.harmony,
      rows.fit,
      rows.color,
      rows.tpo,
      rows.similarImgUrl,
      rows.similarPerson,
      rows.comment);
  }
}
