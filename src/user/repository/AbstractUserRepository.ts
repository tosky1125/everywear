import { SignupUserDto } from '../dto/SignupUserDto';

export abstract class AbstractUserRepository {
  abstract signUp(data: SignupUserDto) : Promise<number>;
}
