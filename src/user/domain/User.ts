import { Gender } from '../../infra/enum/Gender';
import { BodyType } from '../../infra/enum/BodyType';
import { FaceType } from '../../infra/enum/FaceType';
import { SkinType } from '../../infra/enum/SkinType';

export class User {
  private _mail : string;

  private _password : string;

  private _gender : Gender;

  private _name : string;

  private _birthday : Date;

  private _bodyType : BodyType;

  private _faceType : FaceType;

  private _skinType : SkinType;

  private _apple: number;

  constructor(
    mail: string,
    password : string,
    gender: Gender,
    name : string,
    birthday : Date,
    bodyType : BodyType,
    faceType : FaceType,
    skinType : SkinType,
    apple : number,
  ) {
    this._mail = mail;
    this._password = password;
    this._gender = gender;
    this._name = name;
    this._birthday = birthday;
    this._bodyType = bodyType;
    this._faceType = faceType;
    this._skinType = skinType;
    this._apple = apple;
  }

  addApple(number:number) : void {
    this._apple += number;
  }

  useApple(number?:number) : void {
    this._apple -= number || 1;
  }

  get apple() : number {
    return this._apple;
  }

  get mail(): string {
    return this._mail;
  }

  get skinType(): SkinType {
    return this._skinType;
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

  get birthday(): Date {
    return this._birthday;
  }

  get bodyType(): BodyType {
    return this._bodyType;
  }

  get faceType(): FaceType {
    return this._faceType;
  }
}
