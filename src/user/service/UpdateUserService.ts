import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { RequestUserDto } from '../dto/RequestUserDto';
import { UserNotExistError } from '../../auth/error/UserNotExistError';
import { User } from '../domain/User';

export class UpdateUserService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(params : RequestUserDto, user: any) {
    if (!user) {
      throw new UserNotExistError();
    }

    await this.userRepository.update(params, user.mail);
  }
}
