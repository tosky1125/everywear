import { Request, Response, Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import { Controller } from '../infra/util/Controller';
import { SignupUserService } from './service/SignupUserService';
import { UserRepository } from './repository/UserRepository';
import { RequestUserDto } from './dto/RequestUserDto';
import { StatusCode } from '../infra/enum/StatusCode';
import { ResponseResult } from '../infra/enum/ResponseResult';
import AuthenticationDto from '../auth/dto/AuthenticationDto';
import Logger from '../infra/Logger';
import { SignUpUserExistError } from './error/SignUpUserExistError';
import { UpdateUserService } from './service/UpdateUserService';
import { UserNotExistError } from '../auth/error/UserNotExistError';
import { GetSkinTypeService } from './service/GetSkinTypeService';
import { GetFaceTypeService } from './service/GetFaceTypeService';
import { GetBodyTypeService } from './service/GetBodyTypeService';
import { Gender } from '../infra/enum/Gender';
import { GenderValidationError } from './error/GenderValidationError';
import { UploadFileService } from '../file/service/UploadFileService';
import { UpdateUserProfileImageService } from './service/UpdateUserProfileImageService';
import { GetUserService } from './service/GetUserService';
import { CheckMailIsVerbose } from './service/CheckMailIsVerbose';
import { CheckWelcomeApple } from './service/CheckWelcomeApple';

class UserController extends Controller {
  private upload = multer({ dest: 'tmp/' });

  getRouter(): Router {
    const router = Router();
    router.post('/api/v1/user/signup', this.signup);
    router.get('/api/v1/user/skinType', this.skinType);
    router.get('/api/v1/user/faceType', this.faceType);
    router.get('/api/v1/user/bodyType/:gender', this.bodyType);
    router.post('/api/v1/user/profileImage', passport.authenticate('userStrategy1.0'), this.upload.single('file'), this.updateProfileImage);
    router.put('/api/v1/user/update', passport.authenticate('userStrategy1.0'), this.update);
    router.get('/api/v1/user', passport.authenticate('userStrategy1.0'), this.getUser);
    router.post('/api/v1/user/mail', this.mailCheck);
    router.get('/api/v1/user/welcome/', passport.authenticate('userStrategy1.0'), this.checkWelcomeApple);
    return router;
  }

  async checkWelcomeApple(req:Request, res:Response): Promise<void> {
    const service = new CheckWelcomeApple(new UserRepository());
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

  async mailCheck(req:Request, res:Response) : Promise<void> {
    const service = new CheckMailIsVerbose(new UserRepository());
    try {
      const result = await service.execute(req.body.mail);
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

  async getUser(req:Request, res:Response) : Promise<void> {
    const { user } = req;
    const service = new GetUserService(new UserRepository());
    try {
      const result = await service.execute(user.id);
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

  async updateProfileImage(req:Request, res:Response) : Promise<void> {
    const uploadFileService = new UploadFileService();
    const updateFileService = new UpdateUserProfileImageService(new UserRepository());
    const { user } = req;
    try {
      const imgUrl = await uploadFileService.execute(req);
      await updateFileService.execute(user, imgUrl.fileUrl);
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        data: { imgUrl: imgUrl.fileUrl },
      });
    } catch (e) {
      if (e instanceof UserNotExistError) {
        res.status(StatusCode.Notfound).json({
          result: ResponseResult.Fail,
          err: 'ERR_USER_NOTFOUND',
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

  async bodyType(req:Request, res:Response): Promise<void> {
    const service = new GetBodyTypeService(new UserRepository());
    const { gender } = req.params;
    try {
      const result = await service.execute(gender as Gender);
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        data: result,
      });
    } catch (e) {
      if (e instanceof GenderValidationError) {
        res.status(StatusCode.BadRequest).json({
          result: ResponseResult.Fail,
          err: 'ERR_GENDER_VALIDATION',
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

  async faceType(req:Request, res:Response): Promise<void> {
    const service = new GetFaceTypeService(new UserRepository());
    try {
      const result = await service.execute();
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

  async skinType(req:Request, res:Response): Promise<void> {
    const service = new GetSkinTypeService(new UserRepository());
    try {
      const result = await service.execute();
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

  async update(req:Request, res: Response) :Promise<void> {
    const service = new UpdateUserService(new UserRepository());
    const data = req.body as RequestUserDto;
    const { user } = req;
    try {
      await service.execute(data, user);
      res.status(StatusCode.Created).json({
        result: ResponseResult.Success,
      });
    } catch (e) {
      if (e instanceof UserNotExistError) {
        res.status(StatusCode.Notfound).json({
          result: ResponseResult.Fail,
          err: 'ERR_USER_NOTFOUND',
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

  async signup(req: Request, res: Response): Promise<void> {
    const data = req.body as RequestUserDto;
    const service = new SignupUserService(new UserRepository());

    try {
      const result = await service.execute(data);
      res.status(StatusCode.Created).json({
        result: ResponseResult.Success,
        data: AuthenticationDto.toClient(result),
      });
    } catch (e) {
      if (e instanceof SignUpUserExistError) {
        res.status(StatusCode.Conflict).json({
          result: ResponseResult.Fail,
          err: 'ERR_MAIL_DUPLICATE',
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

export default new UserController();
