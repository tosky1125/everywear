import { Request, Response, Router } from 'express';
import passport from 'passport';
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

class UserController extends Controller {
  getRouter(): Router {
    const router = Router();
    router.post('/api/v1/user/signup', this.signup);
    router.put('/api/v1/user', passport.authenticate('userStrategy1.0'), this.update);
    // router.get('/api/v1/user', passport.authenticate('userStrategy1.0'));
    return router;
  }

  async update(req:Request, res: Response) :Promise<void> {
    const service = new UpdateUserService(new UserRepository());
    const data = req.body as RequestUserDto;
    const { user } = req;
    console.log(user);
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
