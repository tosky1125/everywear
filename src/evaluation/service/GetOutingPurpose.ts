import {AbstractEvaluationRepository} from "../repository/AbstractEvaluationRepository";

export class GetOutingPurpose {

  constructor(
    private readonly evaluationRepository : AbstractEvaluationRepository
  ) {
  }

  async execute() {
    const result = await this.evaluationRepository.getPurpose();
    return result;
  }
}
