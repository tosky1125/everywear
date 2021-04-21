import { User } from '../domain/User';
import { IUserRow } from '../dto/IUserRow';

export class UserMapper {
  static toService(data: IUserRow) : User {
    return new User(
      data.mail,
      data.password,
      data.gender,
      data.name,
      data.birthday,
      data.bodyType,
      data.faceType,
      data.skinType,
      data.apple,
    );
  }
}
