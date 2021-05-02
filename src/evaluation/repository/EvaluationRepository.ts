import { AbstractEvaluationRepository } from './AbstractEvaluationRepository';
import { EvaluationRequest } from '../domain/EvaluationRequest';
import { QueryExecutor } from '../../infra/database/QueryExecutor';

export class EvaluationRepository extends AbstractEvaluationRepository {
  async getEvaluationByUserId(userId: number): Promise<any> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const result = await conn('everywear_evaluation').select().where({ userId });
    return result;
  }

  async getUncompletedEvaluation(): Promise<any> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const result = await conn('everywear_evaluation').select().where({ isEvaluated: false });
    return result;
  }

  async updateEvaluation(params: any, evaluationId:number): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_evaluation').update(params).where({ evaluationId });
  }

  getEvaluationById(id: number): Promise<any> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    return conn('everywear_evaluation').select().where({ evaluationId: id });
  }

  getPurpose(): Promise<any[]> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    return conn('everywear_outingPurpose').select();
  }

  async createEvaluation(data: EvaluationRequest): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    return conn('everywear_evaluation').insert({
      userId: data.userId,
      imgUrl: data.imgUrl,
      purpose: data.purpose,
      isEvaluated: data.isEvaluated,
      trend: data.trend,
      harmony: data.harmony,
      fit: data.fit,
      color: data.color,
      tpo: data.tpo,
      score: data.score,
    });
  }
}4;
