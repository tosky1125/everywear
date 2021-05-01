import { AbstractEvaluationRepository } from '../../evaluation/repository/AbstractEvaluationRepository';

export class GetUncompletedEvaluation {
  constructor(
    private readonly evaluationRepository:AbstractEvaluationRepository,
  ) {
  }

  async execute() {
    const result = await this.evaluationRepository.getUncompletedEvaluation();
    return result;
  }
}
