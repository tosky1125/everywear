import { AbstractUserRepository } from './AbstractUserRepository';
import { QueryExecutor } from '../../infra/database/QueryExecutor';
import { RequestUserDto } from '../dto/RequestUserDto';
import { User } from '../domain/User';
import { PasswordAuthDto } from '../../auth/dto/PasswordAuthDto';
import { UserMapper } from '../mapper/UserMapper';
import { OAuthDto } from '../../infra/passport/OAuthDto';
import { AppleValueCase } from '../../infra/enum/AppleValueCase';

export class UserRepository extends AbstractUserRepository {
  async update(data: any, mail:string): Promise<void> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    await conn('everywear_user').update(data).where({ mail });
  }

  async signUp(data: RequestUserDto): Promise<number> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    const [rows] = await conn('everywear_user').insert(data);
    await conn('everywear_apple').insert({ userId: rows, value: 2, reason: AppleValueCase.SignUp });
    return rows;
  }

  async getByMail(data:string): Promise<User> {
    const conn = QueryExecutor.getInstance().getReadConnection();
    const [rows] = await conn('everywear_user as User')
      .select('User.*', 'Skin.skinType', 'Body.bodyType', 'Face.faceType', 't1.apple')
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
}
