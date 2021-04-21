import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';
import { SignInUserDto } from '../../user/dto/SignInUserDto';
import { UserNotExistError } from '../error/UserNotExistError';
import { UserPasswordVerificationError } from '../error/UserPasswordVerificationError';
import { User } from '../../user/domain/User';
import { UserSignInPasswordValidationError } from '../error/UserSignInPasswordValidationError';
import JwtTokenGenerator from '../../infra/passport/JwtGenerator';
import { UserSignResponseDto } from '../dto/UserSignResponseDto';

export class SigninUserService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(dto: SignInUserDto): Promise<UserSignResponseDto> {
    const user = await this.userRepository.getByMail(dto.mail);
    if (!dto.password || !dto.mail) {
      throw new UserSignInPasswordValidationError();
    }

    if (!user) {
      throw new UserNotExistError();
    }

    if (user.password !== dto.password) {
      throw new UserPasswordVerificationError();
    }

    return {
      user,
      token: JwtTokenGenerator.get({
        name: user.name,
        faceType: user.faceType,
        skinType: user.skinType,
        bodyType: user.bodyType,
        mail: user.mail,
      }),
    };
  }
}
