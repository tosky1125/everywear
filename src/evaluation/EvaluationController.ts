import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Controller } from '../infra/util/Controller';
import { CreateEvaluation } from './service/CreateEvaluation';
import { EvaluationRepository } from './repository/EvaluationRepository';
import { PointRangeError } from './error/PointRangeError';
import { StatusCode } from '../infra/enum/StatusCode';
import { ResponseResult } from '../infra/enum/ResponseResult';
import { GetOutingPurpose } from './service/GetOutingPurpose';
import Logger from '../infra/Logger';
import { GetEvaluation } from './service/GetEvaluation';
import { UserRepository } from '../user/repository/UserRepository';
import { RetreiveEvaluationById } from './service/RetreiveEvaluationById';

class EvaluationController extends Controller {
  getRouter(): Router {
    const router = Router();
    router.post('/api/v1/evaluation', passport.authenticate('userStrategy1.0'), this.createEvaluate);
    router.get('/api/v1/evaluation/purpose', passport.authenticate('userStrategy1.0'), this.getOutingPurpose);
    router.get('/api/v1/evaluation/:id', passport.authenticate('userStrategy1.0'), this.getEvaluationById);
    router.get('/api/v1/evaluation', passport.authenticate('userStrategy1.0'), this.getEvaluation);
    return router;
  }

  async getEvaluationById(req:Request, res:Response) {
    const service = new RetreiveEvaluationById(new EvaluationRepository());
    try {
      const result = await service.exeucte(Number(req.params.id));
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

  async getEvaluation(req:Request, res:Response) {
    const service = new GetEvaluation(new EvaluationRepository());
    try {
      const result = await service.execute(req.user);
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

  async createEvaluate(req:Request, res: Response) {
    const service = new CreateEvaluation(new EvaluationRepository(), new UserRepository());
    try {
      const { user } = req;
      await service.execute(user, req.body);
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        message: 'Evaluation Successfully Created',
      });
    } catch (e) {
      if (e instanceof PointRangeError) {
        res.status(StatusCode.BadRequest).json({
          result: ResponseResult.Fail,
          message: e.message,
        });
      }
      Logger.error(e);
      res.status(StatusCode.InternalServerError).json({
        result: ResponseResult.Fail,
        err: 'ERR_INTERNAL_SERVER',
        message: '서버에러가 발생했습니다.',
      });
    }
  }

  async getOutingPurpose(req:Request, res:Response) {
    const service = new GetOutingPurpose(new EvaluationRepository());
    try {
      const result = await service.execute();
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        data: result,
      });
    } catch (e) {
      if (e instanceof PointRangeError) {
        res.status(StatusCode.BadRequest).json({
          result: ResponseResult.Fail,
          message: e.message,
        });
      }
      Logger.error(e);
      res.status(StatusCode.InternalServerError).json({
        result: ResponseResult.Fail,
        err: 'ERR_INTERNAL_SERVER',
        message: '서버에러가 발생했습니다.',
      });
    }
  }
}
export default new EvaluationController();
