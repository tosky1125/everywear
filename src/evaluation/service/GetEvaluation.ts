import { AbstractEvaluationRepository } from '../repository/AbstractEvaluationRepository';
import { User } from '../../user/domain/User';

export class GetEvaluation {
  constructor(
    private readonly evaluationRepository: AbstractEvaluationRepository,
  ) {
  }

  async execute(user:User) {
    const result = await this.evaluationRepository.getEvaluationByUserId(user.id);
    return result;
  }
}
