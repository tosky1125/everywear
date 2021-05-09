import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { User } from '../domain/User';

export class CheckWelcomeApple {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(user:User) :Promise<boolean> {
    const result = await this.userRepository.getAppleHistory(user.id, 'signUp');
    if (!result.welcomeAlert) {
      await this.userRepository.setAppleHistory(result.id);
      return true;
    }
    return false;
  }
}
