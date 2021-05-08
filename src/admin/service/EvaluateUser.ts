import { AbstractEvaluationRepository } from '../../evaluation/repository/AbstractEvaluationRepository';
import { PushEvaluationCompleted } from './PushEvaluationCompleted';
import { UserRepository } from '../../user/repository/UserRepository';

export class EvaluateUser {
  constructor(
    private readonly evaluationRepository: AbstractEvaluationRepository,
  ) {
  }

  async execute(body:any) {
    const {
      evaluationId, ...params
    } = body;

    const evaluation = await this.evaluationRepository.getEvaluationById(evaluationId);
    await this.evaluationRepository.updateEvaluation({ ...params }, evaluationId);
    const push = new PushEvaluationCompleted(new UserRepository());
    await push.execute(body.userId);
  }
}
