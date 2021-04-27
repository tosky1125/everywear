import { AbstractUserRepository } from '../repository/AbstractUserRepository';
import { SkinType } from '../../infra/enum/SkinType';

export class GetSkinTypeService {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute():Promise<SkinType[]> {
    const result = await this.userRepository.getSkinType();
    return result;
  }
}
