import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';

export class GetUserCount {
  constructor(
    private readonly userRepository: AbstractUserRepository,
  ) {
  }

  async execute(): Promise<number> {
    const count = await this.userRepository.countUsers();
    return count;
  }
}
