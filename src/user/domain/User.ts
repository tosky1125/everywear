import { Gender } from '../../infra/enum/Gender';
import { BodyType } from '../../infra/enum/BodyType';
import { FaceType } from '../../infra/enum/FaceType';

export class User {
  private _mail : string;

  private _password : string;

  private _gender : Gender;

  private _name : string;

  private _birthday : number;

  private _bodyType : BodyType;

  private _faceType : FaceType;

  constructor(
    mail: string,
    password : string,
    gender: Gender,
    name : string,
    birthday : number,
    bodyType : BodyType,
    faceType : FaceType,
  ) {
    this._mail = mail;
    this._password = password;
    this._gender = gender;
    this._name = name;
    this._birthday = birthday;
    this._bodyType = bodyType;
    this._faceType = faceType;
  }

  get mail(): string {
    return this._mail;
  }

  get password(): string {
    return this._password;
  }

  get gender(): Gender {
    return this._gender;
  }

  get name(): string {
    return this._name;
  }

  get birthday(): number {
    return this._birthday;
  }

  get bodyType(): BodyType {
    return this._bodyType;
  }

  get faceType(): FaceType {
    return this._faceType;
  }
}
