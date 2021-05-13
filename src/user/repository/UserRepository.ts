import { AbstractUserRepository } from './AbstractUserRepository';
import { QueryExecutor } from '../../infra/database/QueryExecutor';
import { RequestUserDto } from '../dto/RequestUserDto';
import { User } from '../domain/User';
import { PasswordAuthDto } from '../../auth/dto/PasswordAuthDto';
import { UserMapper } from '../mapper/UserMapper';
import { OAuthDto } from '../../infra/passport/OAuthDto';
import { AppleValueCase } from '../../infra/enum/AppleValueCase';
import { SkinType } from '../../infra/enum/SkinType';
import { Gender } from '../../infra/enum/Gender';

export class UserRepository extends AbstractUserRepository {
  async checkMailIsVerbose(mail: string): Promise<any> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_user').select().where({ mail });
    return rows;
  }

  async getDeviceToken(userId: number): Promise<string> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [token] = await conn('everywear_user').select('deviceToken').where({ userId });
    return token.deviceToken;
  }

  async insertUserProfileImage(userId: number, imgUrl: string): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_user_profileImage').insert({ userId, imgUrl });
  }

  async updateUserProfileImage(userId:number, imgUrl: string): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_user_profileImage').update({ imgUrl }).where({ userId });
  }

  async getBodyType(gender:Gender): Promise<any[]> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const result = await conn('everywear_bodyType').select('bodyType', 'imgUrl').where({ gender });
    return result;
  }

  async getFaceType(): Promise<any[]> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const result = await conn('everywear_faceType').select('faceType', 'imgUrl');
    return result;
  }

  async update(data: any, userId:number): Promise<void> {
    const {
      bodyType, faceType, skinType, gender, ...chunk
    } = data;
    if ('birthday' in chunk) {
      chunk.birthday = new Date(chunk.birthday);
    }
    const rConn = QueryExecutor.getInstance().getReadConnection();
    const [bodyTypeId] = bodyType ? await rConn('everywear_bodyType').select('bodyTypeId').where({ bodyType, gender }) : [];
    const [faceTypeId] = faceType ? await rConn('everywear_faceType').select('faceTypeId').where({ faceType }) : [];
    const [skinTypeId] = skinType ? await rConn('everywear_skinType').select('skinTypeId').where({ skinType }) : [];
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_user').update({
      ...chunk, ...bodyTypeId, ...faceTypeId, ...skinTypeId,
    }).where({ userId });
  }

  async signUp(data: RequestUserDto): Promise<number> {
    const {
      bodyType, faceType, skinType, gender, ...chunk
    } = data;
    const rConn = QueryExecutor.getInstance().getReadConnection();
    const [bodyTypeId] = await rConn('everywear_bodyType').select('bodyTypeId').where({ bodyType, gender });
    const [faceTypeId] = await rConn('everywear_faceType').select('faceTypeId').where({ faceType });
    const [skinTypeId] = await rConn('everywear_skinType').select('skinTypeId').where({ skinType });
    const conn = QueryExecutor.getInstance().getWriteConnection();
    const [rows] = await conn('everywear_user').insert({
      ...chunk, ...bodyTypeId, ...faceTypeId, ...skinTypeId, gender,
    });
    await conn('everywear_apple').insert({ userId: rows, value: 10, reason: AppleValueCase.SignUp });
    return rows;
  }

  async getSkinType(): Promise<any[]> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const rows = await conn('everywear_skinType').select('skinType', 'code');
    return rows;
  }

  async getByUserId(userId:number): Promise<User> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_user as User')
      .select('User.*', 'Skin.skinType', 'Body.bodyType', 'Face.faceType', 't1.apple', 'Image.imgUrl')
      .where({ 'User.userId': userId })
      .leftJoin('everywear_skinType as Skin', function () {
        this.on('User.skinTypeId', '=', 'Skin.skinTypeId');
      })
      .leftJoin('everywear_faceType as Face', function () {
        this.on('User.faceTypeId', '=', 'Face.faceTypeId');
      })
      .leftJoin('everywear_bodyType as Body', function () {
        this.on('User.bodyTypeId', '=', 'Body.bodyTypeId');
      })
      .leftJoin('everywear_user_profileImage as Image', function () {
        this.on('User.userId', '=', 'Image.userId');
      })
      .leftJoin(conn.raw(`
      (SELECT 
        userId, SUM(value) AS apple 
      FROM 
        everywear_apple 
      GROUP BY userId) AS t1 
      ON 
        User.userId = t1.userId
      `));
    return UserMapper.toService(rows);
  }

  async getByMail(data:string): Promise<any> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_user as User')
      .select('User.*', 'Skin.skinType', 'Body.bodyType', 'Face.faceType', 't1.apple', 'Image.imgUrl')
      .where({ mail: data })
      .leftJoin('everywear_skinType as Skin', function () {
        this.on('User.skinTypeId', '=', 'Skin.skinTypeId');
      })
      .leftJoin('everywear_faceType as Face', function () {
        this.on('User.faceTypeId', '=', 'Face.faceTypeId');
      })
      .leftJoin('everywear_bodyType as Body', function () {
        this.on('User.bodyTypeId', '=', 'Body.bodyTypeId');
      })
      .leftJoin('everywear_user_profileImage as Image', function () {
        this.on('User.userId', '=', 'Image.userId');
      })
      .leftJoin(conn.raw(`
      (SELECT 
        userId, SUM(value) AS apple 
      FROM 
        everywear_apple 
      GROUP BY userId) AS t1 
      ON 
        User.userId = t1.userId
      `));
    return rows ? UserMapper.toService(rows) : null;
  }

  async getByOAuthInfo(data: OAuthDto): Promise<User> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_user as User')
      .select('User.*', 'Skin.skinType', 'Body.bodyType', 'Face.faceType', 't1.apple')
      .where({ provider: data.provider, oAuthId: data.oAuthId })
      .leftJoin('everywear_skinType as Skin', function () {
        this.on('User.skinTypeId', '=', 'Skin.skinTypeId');
      })
      .leftJoin('everywear_faceType as Face', function () {
        this.on('User.faceTypeId', '=', 'Face.faceTypeId');
      })
      .leftJoin('everywear_bodyType as Body', function () {
        this.on('User.bodyTypeId', '=', 'Body.bodyTypeId');
      })
      .leftJoin(conn.raw(`
      (SELECT 
        userId, SUM(value) AS apple 
      FROM 
        everywear_apple 
      GROUP BY userId) AS t1 
      ON 
        User.userId = t1.userId
      `));
    return UserMapper.toService(rows);
  }

  async getAppleHistory(userId: number, reason: string) :Promise<any> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [result] = await conn('everywear_apple').select().where({ userId, reason });
    return result;
  }

  async setAppleHistory(id: number): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_apple').update({ welcomeAlert: true }).where({ id });
  }

  async useApple(userId: number, amount: number): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_apple').decrement('value', amount).where({ userId });
  }

  async countUsers(): Promise<number> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_user').count('userId as count');
    return Number(rows.count);
  }

  async countLogin(): Promise<number> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_loginCount').sum('loginCount');
    return Number(rows['sum(`loginCount`)']);
  }

  async addLogin(userId: number): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_loginCount').increment('loginCount').where({ userId });
  }
}
