import { AbstractUserRepository } from '../repository/AbstractUserRepository';

export class GetFaceTypeService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute() {
    const result = await this.userRepository.getFaceType();
    return result;
  }
}
