import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { Gender } from '../../infra/enum/Gender';
import { GenderValidationError } from '../error/GenderValidationError';

export class GetBodyTypeService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(gender:Gender) {
    if (!gender) {
      throw new GenderValidationError();
    }
    const result = await this.userRepository.getBodyType(gender);
    return result;
  }
}
