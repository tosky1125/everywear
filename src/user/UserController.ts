import { Request, Response, Router } from 'express';
import { Controller } from '../infra/util/Controller';
import { SignupUserService } from './service/SignupUserService';
import { UserRepository } from './repository/UserRepository';
import { SignupUserDto } from './dto/SignupUserDto';
import { InternalServerError } from '../infra/error/InternalServerError';
import { StatusCode } from '../infra/enum/StatusCode';

class UserController extends Controller {
  getRouter(): Router {
    const router = Router();
    router.post('/api/v1/user/signup', this.signup);
    return router;
  }

  async signup(req: Request, res: Response) {
    const data = req.body;
    const service = new SignupUserService(new UserRepository());

    try {
      const result = await service.execute(data as SignupUserDto);
      res.status(StatusCode.Created).json({ userId: result });
    } catch (e) {
      if (e instanceof InternalServerError) {
        res.status(StatusCode.InternalServerError).json({ result: fail });
      }
    }
  }
}

export default new UserController();
