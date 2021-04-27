import { User } from '../../user/domain/User';
import { EvaluationRequest } from '../domain/EvaluationRequest';
import { AbstractEvaluationRepository } from '../repository/AbstractEvaluationRepository';

export class CreateEvaluation {
  constructor(
    private readonly evaluationRepository : AbstractEvaluationRepository,
  ) {
  }

  async execute(user:User, params) {
    const { imgUrl, purpose } = params;
    const evaluation = new EvaluationRequest(user.id, imgUrl, purpose, false, 0, 0, 0, 0, 0);
    await this.evaluationRepository.createEvaluation(evaluation);
  }
}
