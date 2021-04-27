import { Gender } from '../../infra/enum/Gender';
import { BodyType } from '../../infra/enum/BodyType';
import { FaceType } from '../../infra/enum/FaceType';
import { SkinType } from '../../infra/enum/SkinType';
import { AuthProvider } from '../../infra/enum/AuthProvider';

export class User {
  private _id : number;

  private _mail : string | null;

  private _password : string | null;

  private _gender : Gender | null;

  private _name : string | null;

  private _birthday : Date | null;

  private _bodyType : BodyType | null;

  private _faceType : FaceType | null;

  private _skinType : SkinType | null;

  private _apple : number | null;

  private _oAuthId : number | null;

  private _provider : AuthProvider | null;

  private _profileImage : string | null;

  constructor(
    id: number,
    mail: string | null,
    password : string | null,
    gender: Gender | null,
    name : string | null,
    birthday : Date | null,
    bodyType : BodyType | null,
    faceType : FaceType | null,
    skinType : SkinType | null,
    apple : number | null,
    oAuthId : number | null,
    provider : AuthProvider | null,
    profileImage : string | null,
  ) {
    this._id = id;
    this._mail = mail;
    this._password = password;
    this._gender = gender;
    this._name = name;
    this._birthday = birthday;
    this._bodyType = bodyType;
    this._faceType = faceType;
    this._skinType = skinType;
    this._apple = apple;
    this._oAuthId = oAuthId;
    this._provider = provider;
    this._profileImage = profileImage;
  }

  get id(): number {
    return this._id;
  }

  get oAuthId(): number | null {
    return this._oAuthId;
  }

  get provider(): AuthProvider | null {
    return this._provider;
  }

  get profileImage(): string | null {
    return this._profileImage;
  }

  addApple(number:number) : void {
    if (!this._apple) this._apple = 0;
    this._apple += number;
  }

  useApple(number?:number) : void {
    if (!this._apple) this._apple = 0;
    this._apple -= number || 1;
  }

  get apple() : number | null {
    return this._apple;
  }

  get mail(): string | null {
    return this._mail;
  }

  get skinType(): SkinType | null {
    return this._skinType;
  }

  get password(): string | null {
    return this._password;
  }

  get gender(): Gender | null {
    return this._gender;
  }

  get name(): string | null {
    return this._name;
  }

  get birthday(): Date | null {
    return this._birthday;
  }

  get bodyType(): BodyType | null {
    return this._bodyType;
  }

  get faceType(): FaceType | null {
    return this._faceType;
  }
}
