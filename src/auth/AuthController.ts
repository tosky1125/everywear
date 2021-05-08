import { Request, Response, Router } from 'express';
import passport from 'passport';
import { Controller } from '../infra/util/Controller';
import { StatusCode } from '../infra/enum/StatusCode';
import { SigninUserService } from './service/SigninUserService';
import { UserRepository } from '../user/repository/UserRepository';
import { SignInUserDto } from '../user/dto/SignInUserDto';
import { ResponseResult } from '../infra/enum/ResponseResult';
import AuthenticationDto from './dto/AuthenticationDto';
import { UserSignInPasswordValidationError } from './error/UserSignInPasswordValidationError';
import { UserNotExistError } from './error/UserNotExistError';
import { UserPasswordVerificationError } from './error/UserPasswordVerificationError';
import Logger from '../infra/Logger';
import { ResetUserPassword } from './service/ResetUserPassword';
import { MailValidationError } from './error/MailValidationError';

class AuthController extends Controller {
  getRouter(): Router {
    const router = Router();
    router.get('/api/v1/auth/kakao', passport.authenticate('kakao'));
    router.get('/api/v1/auth/kakao/callback', passport.authenticate('kakao'), this.callback);
    router.get('/api/v1/auth/naver', passport.authenticate('naver'));
    router.get('/api/v1/auth/naver/callback', passport.authenticate('naver'), this.callback);
    router.post('/api/v1/auth/password', this.signIn);
    router.post('/api/v1/auth/reset', this.resetPassword);
    return router;
  }

  callback(req : Request, res : Response) {
    const { user } = req;
    if (user?.exist) {
      res.status(StatusCode.Unauthorized).json({
        result: ResponseResult.Fail,
        message: '로그인 성공했으나 회원정보가 존재하지 않아 회원가입을 진행합니다.',
        data: {
          provider: user.provider,
          oAuthId: user.oAuthId,
        },
      });
    } else {
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        data: user,
      });
    }
  }

  async signIn(req : Request, res : Response) : Promise<void> {
    const service = new SigninUserService(new UserRepository());
    try {
      const result = await service.execute(req.body as SignInUserDto);
      res.status(StatusCode.Ok).json({
        result: ResponseResult.Success,
        data: AuthenticationDto.toClient(result),
      });
    } catch (e) {
      if (e instanceof UserSignInPasswordValidationError) {
        res.status(StatusCode.BadRequest).json({
          result: ResponseResult.Fail,
          err: 'ERR_INPUT_VALIDATION',
          message: e.message,
        });
      }
      if (e instanceof UserNotExistError) {
        res.status(StatusCode.Notfound).json({
          result: ResponseResult.Fail,
          err: 'ERR_USER_NOTFOUND',
          message: e.message,
        });
      }
      if (e instanceof UserPasswordVerificationError) {
        res.status(StatusCode.Unauthorized).json({
          result: ResponseResult.Fail,
          err: 'ERR_VERIFICATION',
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

  async resetPassword(req : Request, res : Response) : Promise<void> {
    const service = new ResetUserPassword(new UserRepository());
    try {
      await service.execute(req.body);
      res.status(StatusCode.Ok).json({
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

      if (e instanceof MailValidationError) {
        res.status(StatusCode.BadRequest).json({
          result: ResponseResult.Fail,
          err: 'ERR_INPUT_VALIDATION',
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

export default new AuthController();
