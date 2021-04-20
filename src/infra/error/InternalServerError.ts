interface IError extends Error {
  sql?: string;
}

export class InternalServerError extends Error {
  public readonly sql: string | null;

  constructor(err: IError) {
    super(`서버 에러가 발생하였습니다. ${err}`);
    this.stack = `${this.stack}\n-----\n${err.stack}`;
    this.sql = err.sql || null;
  }
}
