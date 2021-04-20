import { AbstractUserRepository } from './AbstractUserRepository';
import { QueryExecutor } from '../../infra/database/QueryExecutor';
import { SignupUserDto } from '../dto/SignupUserDto';

export class UserRepository extends AbstractUserRepository {
  async signUp(data: SignupUserDto): Promise<number> {
    const conn = QueryExecutor.getInstance().getWriteConnection();
    const [rows] = await conn('everywear_user').insert(data);
    return rows;
  }
}
