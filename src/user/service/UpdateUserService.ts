import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { RequestUserDto } from '../dto/RequestUserDto';
import { UserNotExistError } from '../../auth/error/UserNotExistError';

export class UpdateUserService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(params : RequestUserDto, user) {
    if (!user) {
      throw new UserNotExistError();
    }

    await this.userRepository.update(params, user.mail);
  }
}
