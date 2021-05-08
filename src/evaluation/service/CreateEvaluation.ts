import { User } from '../../user/domain/User';
import { EvaluationRequest } from '../domain/EvaluationRequest';
import { AbstractEvaluationRepository } from '../repository/AbstractEvaluationRepository';
import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';

export class CreateEvaluation {
  constructor(
    private readonly evaluationRepository : AbstractEvaluationRepository,
    private readonly userRepository: AbstractUserRepository,
  ) {
  }

  async execute(user:User, body) {
    const { imgUrl, purpose, deviceToken } = body;
    const evaluation = new EvaluationRequest(0, user.id, imgUrl, purpose, false, 0, 0, 0, 0, 0);
    await this.evaluationRepository.createEvaluation(evaluation);
    await this.userRepository.update({ deviceToken }, user.id);
  }
}
