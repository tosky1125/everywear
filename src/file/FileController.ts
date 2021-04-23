import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Controller } from '../infra/util/Controller';
import { UploadFileService } from './service/UploadFileService';
import { StatusCode } from '../infra/enum/StatusCode';
import { ResponseResult } from '../infra/enum/ResponseResult';
import { FileDBInsertError } from './error/FileDBInsertError';
import { S3UploadError } from './error/S3UploadError';
import { FileNotExistError } from './error/FileNotExistError';
import { FileStreamError } from './error/FileStreamError';
import { InvalidFileError } from './error/InvalidFileError';
import { InvalidFileSizeError } from './error/InvalidFileSizeError';
import { InvalidMimeTypeError } from './error/InvalidMimeTypeError';
import Logger from '../infra/Logger';

class FileController extends Controller {
  private upload = multer({ dest: 'tmp/' });

  getRouter(): Router {
    const router = Router();
    router.post('/api/v1/file', this.upload.single('file'), this.fileCreate);
    return router;
  }

  async fileCreate(req:Request, res: Response): Promise<void> {
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
}

export default new FileController();
