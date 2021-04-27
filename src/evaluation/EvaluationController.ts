import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Controller } from '../infra/util/Controller';
import { CreateEvaluation } from './service/CreateEvaluation';
import { EvaluationRepository } from './repository/EvaluationRepository';
import { PointRangeError } from './error/PointRangeError';
import { StatusCode } from '../infra/enum/StatusCode';
import { ResponseResult } from '../infra/enum/ResponseResult';

class EvaluationController extends Controller {
  getRouter(): Router {
    const router = Router();
    router.post('/api/v1/evaluation', passport.authenticate('userStrategy1.0', this.createEvaluate));
    return router;
  }

  async createEvaluate(req:Request, res: Response) {
    const service = new CreateEvaluation(new EvaluationRepository());
    try {
      const { user } = req;
      await service.execute(req.user, req.body);
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
    }
  }
}