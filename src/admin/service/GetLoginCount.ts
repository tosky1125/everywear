import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';

export class GetLoginCount {
  constructor(private readonly userRepository: AbstractUserRepository) {
  }

  async execute(): Promise<number> {
    const users = await this.userRepository.countUsers();
    const login = await this.userRepository.countLogin();
    return login / users;
  }
}
