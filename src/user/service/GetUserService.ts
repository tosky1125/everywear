import { AbstractUserRepository } from '../repository/AbstractUserRepository';

export class GetUserService {
  constructor(
    private readonly userRepository :AbstractUserRepository,
  ) {
  }

  async execute(userId:number) {
    const user = await this.userRepository.getByUserId(userId);
    return user;
  }
}
