import { AbstractEvaluationRepository } from '../../evaluation/repository/AbstractEvaluationRepository';

export class GetEvaluationCount {
  constructor(
    private readonly evaluationRepository: AbstractEvaluationRepository,
  ) {
  }

  async execute() :Promise<number> {
    const count = await this.evaluationRepository.countEvaluations();
    return count;
  }
}
