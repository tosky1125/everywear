import { AbstractUserRepository } from '../../user/repository/AbstractUserRepository';
import { MailValidationError } from '../error/MailValidationError';
import { UserNotExistError } from '../error/UserNotExistError';

import { PasswordResetMail } from './PasswordResetMail';
import { GenerateRandomPassword } from './GenerateRandomPassword';

export class ResetUserPassword {
  constructor(
    private readonly userRepository : AbstractUserRepository,
  ) {
  }

  async execute(body: any) : Promise<void> {
    const { mail } = body;
    if (!mail) {
      throw new MailValidationError();
    }

    const user = await this.userRepository.getByMail(mail);

    if (!user) {
      throw new UserNotExistError();
    }

    const password = GenerateRandomPassword.get();

    await this.userRepository.update({ password });

    await new PasswordResetMail().send(mail, password);
  }
}
