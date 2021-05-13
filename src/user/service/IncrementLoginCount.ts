import { AbstractUserRepository } from '../repository/AbstractUserRepository';

export class IncrementLoginCount {
  constructor(
    private readonly userRepository: AbstractUserRepository,
  ) {
  }

  async execute(userId:number) {
    await this.userRepository.addLogin(userId);
  }
}
