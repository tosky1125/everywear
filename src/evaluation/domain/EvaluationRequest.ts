import { OutingPurpose } from '../../infra/enum/OutingPurpose';
import { EvaluatingGrade } from '../../infra/enum/EvaluatingGrade';
import { IUpdateScore } from '../interface/UpdateScore';
import { PointRangeError } from '../error/PointRangeError';

export class EvaluationRequest {
  private _similarImgUrl: string | null;

  private _similarPerson: string | null;

  private _comment: string | null;

  private _imgUrl : string;

  private _purpose : OutingPurpose;

  private _userId : number;

  private _isEvaluated : boolean;

  private _trend = 0;

  private _harmony = 0;

  private _fit = 0;

  private _color = 0;

  private _tpo = 0;

  private _grade? : EvaluatingGrade | null;

  private _score: number;

  constructor(
    userId : number,
    imgUrl : string,
    purpose : OutingPurpose,
    isEvaluated : boolean,
    trend : number,
    harmony : number,
    fit : number,
    color : number,
    tpo : number,
    similarImgUrl? : string,
    similarPerson?: string,
    comment?: string,
  ) {
    this._similarImgUrl = similarImgUrl || null;
    this._similarPerson = similarPerson || null;
    this._comment = comment || null;
    this._userId = userId;
    this._imgUrl = imgUrl;
    this._purpose = purpose;
    this._isEvaluated = isEvaluated;
    if (trend > 5 || trend < 0
      || harmony > 5 || harmony < 0
      || fit > 5 || fit < 0
      || color > 5 || color < 0
      || tpo > 5 || tpo < 0) {
      throw new PointRangeError();
    }
    this._trend = trend || 0;
    this._harmony = harmony || 0;
    this._fit = fit || 0;
    this._color = color || 0;
    this._tpo = tpo || 0;
    this._score = this.getScore();
    this.setScore();
    this.gradeEvaluation();
    if (this._trend !== 0 || this._harmony !== 0 || this._fit !== 0 || this._color !== 0 || this._tpo !== 0) {
      this.gradeEvaluation();
    }
  }

  get imgUrl(): string {
    return this._imgUrl;
  }

  get purpose(): OutingPurpose {
    return this._purpose;
  }

  get userId(): number {
    return this._userId;
  }

  get similarImgUrl(): string | null {
    return this._similarImgUrl;
  }

  get similarPerson(): string | null {
    return this._similarPerson;
  }

  get comment(): string | null {
    return this._comment;
  }

  get isEvaluated(): boolean {
    return this._isEvaluated;
  }

  get trend(): number {
    return this._trend;
  }

  get harmony(): number {
    return this._harmony;
  }

  get fit(): number {
    return this._fit;
  }

  get color(): number {
    return this._color;
  }

  get tpo(): number {
    return this._tpo;
  }

  get grade(): EvaluatingGrade {
    return this._grade;
  }

  get score(): number {
    return this._score;
  }

  setScore() : void {
    this._score = this.getScore();
  }

  getScore() : number {
    return this._score;
  }

  gradeEvaluation() {
    const score = this.getScore();
    this._grade = score >= 3.5 ? EvaluatingGrade.Good : EvaluatingGrade.Bad;
  }

  completeEvaluation() {
    this._isEvaluated = true;
  }
}
