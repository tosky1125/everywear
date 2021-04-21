import { RequestUserDto } from '../dto/RequestUserDto';
import { User } from '../domain/User';
import { PasswordAuthDto } from '../../auth/dto/PasswordAuthDto';
import { OAuthDto } from '../../infra/passport/OAuthDto';

export abstract class AbstractUserRepository {
  abstract signUp(data: RequestUserDto) : Promise<number>;

  abstract getByMail(data: string) : Promise<any>;

  abstract getByOAuthInfo(data: OAuthDto) : Promise<User>;

  abstract update(data:any, mail:string) : Promise<void>;
}
