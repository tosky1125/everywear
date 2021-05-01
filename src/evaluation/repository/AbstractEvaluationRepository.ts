import { EvaluationRequest } from '../domain/EvaluationRequest';

export abstract class AbstractEvaluationRepository {
  abstract createEvaluation(data:EvaluationRequest) : Promise<void>;

  abstract getPurpose(): Promise<any[]>
}
