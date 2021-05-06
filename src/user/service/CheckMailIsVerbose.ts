import { AbstractUserRepository } from '../repository/AbstractUserRepository';

export class CheckMailIsVerbose {
  constructor(
    private readonly userRepository: AbstractUserRepository,
  ) {
  }

  async execute(mail:string) {
    const result = await this.userRepository.checkMailIsVerbose(mail);
    if (result) {
      return false;
    }
    return true;
  }
}
