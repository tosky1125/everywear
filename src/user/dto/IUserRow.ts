import { Gender } from '../../infra/enum/Gender';
import { BodyType } from '../../infra/enum/BodyType';
import { FaceType } from '../../infra/enum/FaceType';
import { SkinType } from '../../infra/enum/SkinType';
import { AuthProvider } from '../../infra/enum/AuthProvider';

export interface IUserRow {
  userId: number,
  mail: string;
  password: string;
  gender: Gender;
  name: string;
  birthday: Date;
  bodyType: BodyType;
  faceType: FaceType;
  skinType: SkinType;
  apple: number;
  oAuthId : number | null,
  provider : AuthProvider | null,
  imgUrl : string;
}
