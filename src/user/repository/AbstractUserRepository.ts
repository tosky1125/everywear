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

  abstract update(data:any, userId:number) : Promise<void>;

  abstract getSkinType() : Promise<SkinType[]>;

  abstract getFaceType() : Promise<any[]>;

  abstract getBodyType(gender:Gender) : Promise<any[]>;

  abstract updateUserProfileImage(userId:number, imgUrl: string) : Promise<void>;

  abstract insertUserProfileImage(userId:number, imgUrl: string) : Promise<void>;

  abstract getByUserId(userId: number): Promise<User>;

  abstract getDeviceToken(userId:number):Promise<string>;

  abstract checkMailIsVerbose(mail:string):Promise<any>;

  abstract getAppleHistory(userId:number, reason: string):Promise<any>;

  abstract setAppleHistory(id:number):Promise<void>;

  abstract useApple(userId:number, amount:number) : Promise<void>;

  abstract countUsers(): Promise<number>;

  abstract countLogin(): Promise<number>;

  abstract addLogin(userId:number): Promise<void>;
}
