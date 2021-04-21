import { Gender } from '../../infra/enum/Gender';
import { BodyType } from '../../infra/enum/BodyType';
import { FaceType } from '../../infra/enum/FaceType';
import { SkinType } from '../../infra/enum/SkinType';

export interface RequestUserDto {
  mail: string,
  password : string,
  gender: Gender,
  name : string,
  birthday : Date,
  bodyType : BodyType,
  faceType : FaceType,
  skinType : SkinType
}
