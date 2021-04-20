import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { SignupUserDto } from '../dto/SignupUserDto';
import { InternalServerError } from '../../infra/error/InternalServerError';

export class SignupUserService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(data:SignupUserDto) {
    try {
      const result = await this.userRepository.signUp(data);
      return result;
    } catch (e) {
      throw new InternalServerError(e);
    }
  }
}
