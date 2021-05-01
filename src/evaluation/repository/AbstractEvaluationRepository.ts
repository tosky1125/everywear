import { EvaluationRequest } from '../domain/EvaluationRequest';

export abstract class AbstractEvaluationRepository {
  abstract createEvaluation(data:EvaluationRequest) : Promise<void>;

  abstract getPurpose(): Promise<any[]>;

  abstract getEvaluationById(id: number) : Promise<any>;

  abstract getUncompletedEvaluation() : Promise<any>;

  abstract updateEvaluation(params:any, evaluationId:number) : Promise<void>;
}
