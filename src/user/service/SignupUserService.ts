import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { RequestUserDto } from '../dto/RequestUserDto';
import { User } from '../domain/User';
import JwtTokenGenerator from '../../infra/passport/JwtGenerator';
import { UserSignResponseDto } from '../../auth/dto/UserSignResponseDto';
import { SignUpUserExistError } from '../error/SignUpUserExistError';

export class SignupUserService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(data:RequestUserDto):Promise<UserSignResponseDto> {
    const isExist = await this.userRepository.getByMail(data.mail);
    if (isExist) {
      throw new SignUpUserExistError();
    }

    const result = await this.userRepository.signUp(data);

    const user = new User(
      result,
      data.mail,
      data.password,
      data.gender,
      data.name,
      data.birthday,
      data.bodyType,
      data.faceType,
      data.skinType,
      2,
      null,
      null,
      null,
    );

    return {
      user,
      token: JwtTokenGenerator.get({
        name: user.name,
        faceType: user.faceType,
        skinType: user.skinType,
        bodyType: user.bodyType,
        mail: user.mail,
        apple: user.apple,
      }),
    } as UserSignResponseDto;
  }
}
