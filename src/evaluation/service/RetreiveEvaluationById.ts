import { AbstractEvaluationRepository } from '../repository/AbstractEvaluationRepository';

export class RetreiveEvaluationById {
  constructor(
    private readonly evaluationRepository: AbstractEvaluationRepository,
  ) {
  }

  async exeucte(id:number) {
    const result = await this.evaluationRepository.getEvaluationById(id);
    return result;
  }
}
