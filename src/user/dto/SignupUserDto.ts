import { Gender } from '../../infra/enum/Gender';
import { BodyType } from '../../infra/enum/BodyType';
import { FaceType } from '../../infra/enum/FaceType';

export interface SignupUserDto {
  mail: string,
  password : string,
  gender: Gender,
  name : string,
  birthday : number,
  bodyType : BodyType,
  faceType : FaceType,
}
