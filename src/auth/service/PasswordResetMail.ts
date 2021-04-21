import nodemailer from 'nodemailer';
import { ApplicationConfig } from '../../infra/ApplicationConfig';

export class PasswordResetMail {
  private getModule() {
    return nodemailer.createTransport({
      service: ApplicationConfig.getMailService(),
      host: ApplicationConfig.getMailHost(),
      port: ApplicationConfig.getPort(),
      secure: false,
      auth: {
        user: ApplicationConfig.getMailAddress(),
        pass: ApplicationConfig.getMailPassword(),
      },
    });
  }

  async send(mail:string, password : string) {
    const module = this.getModule();
    await module.sendMail({
      from: `"EVERYWEAR" <${ApplicationConfig.getMailAddress()}>`,
      to: mail,
      subject: 'Everywear 비밀번호 초기화',
      text: `초기화된 비밀번호는 ${password} 입니다.`,
    });
  }
}
