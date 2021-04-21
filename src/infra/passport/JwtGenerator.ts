import jwt from 'jsonwebtoken';
import { ApplicationConfig } from '../ApplicationConfig';

export default class JwtTokenGenerator {
  public static get(payload: Record<string, any>): string {
    return jwt.sign(payload, ApplicationConfig.getJwtSecret(), {
      algorithm: 'HS256',
    });
  }
}
