import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { User } from '../domain/User';
import { UserNotExistError } from '../../auth/error/UserNotExistError';

export class UpdateUserProfileImageService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(user: any, imgUrl :string) : Promise<void> {
    if (!user) {
      throw new UserNotExistError();
    }

    if (user.profileImage === null) {
      await this.userRepository.insertUserProfileImage(user.id, imgUrl);
    }

    if (user.profileImage) {
      await this.userRepository.updateUserProfileImage(user.id, imgUrl);
    }
  }
}
