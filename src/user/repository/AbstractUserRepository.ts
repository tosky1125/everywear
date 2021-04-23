import { RequestUserDto } from '../dto/RequestUserDto';
import { User } from '../domain/User';
import { PasswordAuthDto } from '../../auth/dto/PasswordAuthDto';
import { OAuthDto } from '../../infra/passport/OAuthDto';
import { SkinType } from '../../infra/enum/SkinType';
import { Gender } from '../../infra/enum/Gender';

export abstract class AbstractUserRepository {
  abstract signUp(data: RequestUserDto) : Promise<number>;

  abstract getByMail(data: string) : Promise<any>;

  abstract getByOAuthInfo(data: OAuthDto) : Promise<User>;

  abstract update(data:any, mail:string) : Promise<void>;

  abstract getSkinType() : Promise<SkinType[]>;

  abstract getFaceType() : Promise<any[]>;

  abstract getBodyType(gender:Gender) : Promise<any[]>;
}
