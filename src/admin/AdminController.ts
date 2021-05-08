import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Controller } from '../infra/util/Controller';
import { EvaluateUser } from './service/EvaluateUser';
import { EvaluationRepository } from '../evaluation/repository/EvaluationRepository';
import { StatusCode } from '../infra/enum/StatusCode';
import { ResponseResult } from '../infra/enum/ResponseResult';
import Logger from '../infra/Logger';
import { GetUncompletedEvaluation } from './service/GetUncompletedEvaluation';
import { PushEvaluationCompleted } from './service/PushEvaluationCompleted';
import { UserRepository } from '../user/repository/UserRepository';
import { UploadFileService } from '../file/service/UploadFileService';
import { FileDBInsertError } from '../file/error/FileDBInsertError';
import { S3UploadError } from '../file/error/S3UploadError';
import { FileNotExistError } from '../file/error/FileNotExistError';
import { FileStreamError } from '../file/error/FileStreamError';
import { InvalidFileError } from '../file/error/InvalidFileError';
import { InvalidFileSizeError } from '../file/error/InvalidFileSizeError';
import { InvalidMimeTypeError } from '../file/error/InvalidMimeTypeError';

class AdminController extends Controller {
  private upload = multer({ dest: 'tmp/' });

  getRouter(): Router {
    const router = Router();
    router.get('/api/v1/admin/evaluate', this.getUncompletedEvaluation);
    router.post('/api/v1/admin/evaluate/file', this.upload.single('file'), this.uploadFile);
    router.post('/api/v1/admin/evaluate', this.evaluateUser);
    router.get('/api/shawn', this.pushTest);
    return router;
  }

  async uploadFile(req:Request, res:Response) {
    const service = new UploadFileService();
    try {
      const data = await service.execute(req);
      res.status(StatusCode.Created).json({
        result: ResponseResult.Success,
        data,
      });
    } catch (e) {
      if (e instanceof FileDBInsertError) {
        res.status(StatusCode.InternalServerError).json({
          result: ResponseResult.Fail,
          err: 'ERR_DB_INSERT',
          message: e.message,
        });
      }
      if (e instanceof S3UploadError) {
        res.status(StatusCode.InternalServerError).json({
          result: ResponseResult.Fail,
          err: 'ERR_S3_UPLOAD',
          message: e.message,
        });
      }
      if (e instanceof FileNotExistError) {
        res.status(StatusCode.BadRequest).json({
          result: ResponseResult.Fail,
          err: 'ERR_FILE_NOT_EXIST',
          message: e.message,
        });
      }
      if (e instanceof FileStreamError) {
        res.status(StatusCode.InternalServerError).json({
          result: ResponseResult.Fail,
          err: 'ERR_FILE_STREAM',
          message: e.message,
        });
      }
      if (e instanceof InvalidFileError) {
        res.status(StatusCode.InternalServerError).json({
          result: ResponseResult.Fail,
          err: 'ERR_INVALID_FILE',
          message: e.message,
        });
      }

      if (e instanceof InvalidFileSizeError) {
        res.status(StatusCode.InternalServerError).json({
          result: ResponseResult.Fail,
          err: 'ERR_FILE_SIZE',
          message: e.message,
        });
      }

      if (e instanceof InvalidMimeTypeError) {
        res.status(StatusCode.InternalServerError).json({
          result: ResponseResult.Fail,
          err: 'ERR_MIME_TYPE',
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

  async pushTest(req:Request, res:Response) {
    const service = new PushEvaluationCompleted(new UserRepository());
    try {
      await service.execute(1);
      res.status(200).send('hi');
    } catch (e) {
      Logger.error(e);
      res.status(500).send('bye');
    }
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
      await service.execute(req);
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
