import { ApplicationConfig } from '../../infra/ApplicationConfig';

export class GenerateRandomPassword {
  static get():string {
    const length = ApplicationConfig.getRandomPasswordLength();
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result.push(characters.charAt(Math.floor(Math.random()
          * charactersLength)));
    }
    return result.join('');
  }
}
