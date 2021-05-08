import { AbstractEvaluationRepository } from '../../evaluation/repository/AbstractEvaluationRepository';
import { PushEvaluationCompleted } from './PushEvaluationCompleted';
import { UserRepository } from '../../user/repository/UserRepository';
import { EvaluatingGrade } from '../../infra/enum/EvaluatingGrade';

const FileSizeLimit = 30 * 1024 * 1024;

function mimeTypeToExtension(mimeType:string): string {
  switch (mimeType) {
    case ('image/gif'):
      return 'gif';
    case ('image/png'):
      return 'png';
    case ('image/jpeg'):
      return 'jpg';
    default:
      return 'webp';
  }
}
export class EvaluateUser {
  constructor(
    private readonly evaluationRepository: AbstractEvaluationRepository,
  ) {
  }

  async execute(req:any) {
    const {
      evaluationId, ...params
    } = req.body;
    const score = (Number(params.fit) + Number(params.harmony) + Number(params.fit) + Number(params.color) + Number(params.tpo)) / 5;
    const grade = score >= 3.5 ? EvaluatingGrade.Good : EvaluatingGrade.Bad;
    await this.evaluationRepository.updateEvaluation({
      ...params, score, isEvaluated: true, evaluatedAt: new Date(), grade,
    }, evaluationId);
    const push = new PushEvaluationCompleted(new UserRepository());
    await push.execute(req.body.userId);
  }
}
