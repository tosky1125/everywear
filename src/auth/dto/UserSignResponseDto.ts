import { User } from '../../user/domain/User';

export interface UserSignResponseDto {
  user : User,
  token : string
}
