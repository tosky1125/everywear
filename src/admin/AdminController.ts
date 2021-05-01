import { Router, Request, Response } from 'express';
import { Controller } from '../infra/util/Controller';
import { EvaluateUser } from './service/EvaluateUser';
import { EvaluationRepository } from '../evaluation/repository/EvaluationRepository';
import { StatusCode } from '../infra/enum/StatusCode';
import { ResponseResult } from '../infra/enum/ResponseResult';
import Logger from '../infra/Logger';
import { GetUncompletedEvaluation } from './service/GetUncompletedEvaluation';

class AdminController extends Controller {
  getRouter(): Router {
    const router = Router();
    router.get('/api/v1/admin/evaluate', this.getUncompletedEvaluation);
    router.post('/api/v1/admin/evaluate', this.evaluateUser);
    return router;
  }

  async getUncompletedEvaluation(req:Request, res:Response): Promise<void> {
    const service = new GetUncompletedEvaluation(new EvaluationRepository());
    try {
      const result = await service.execute();
      await service.execute(req.body);
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        data: result,
      });
    } catch (e) {
      Logger.error(e);
      res.status(StatusCode.InternalServerError).json({
        result: ResponseResult.Fail,
        err: 'ERR_INTERNAL_SERVER',
        message: '서버에러가 발생했습니다.',
      });
    }
  }

  async evaluateUser(req:Request, res:Response): Promise<void> {
    const service = new EvaluateUser(new EvaluationRepository());
    try {
      await service.execute(req.body);
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        message: 'Evaluation Completed',
      });
    } catch (e) {
      Logger.error(e);
      res.status(StatusCode.InternalServerError).json({
        result: ResponseResult.Fail,
        err: 'ERR_INTERNAL_SERVER',
        message: '서버에러가 발생했습니다.',
      });
    }
  }
}

export default new AdminController();
