export class ApplicationConfig {
  static dbName = process.env.NAME || 'everywear';

  static user = process.env.USER || 'admin';

  static password = process.env.PASSWORD || 'everywear2021!@';

  static dialect = process.env.DIALECT || 'mysql';

  static timezone = process.env.TIMEZONE || 'Asia/Seoul';

  static read = process.env.READ;

  static write = process.env.WRITE;

  static charset = process.env.CHARSET || 'utf8';

  static poolMin = process.env.POOL_MIN || 0;

  static poolMax = process.env.POOL_MAX || 0;

  static dbNameTest = process.env.NAME || 'everywear';

  static userTest = process.env.USER || 'admin';

  static passwordTest = process.env.PASSWORD || 'everywear2021!@';

  static dialectTest = process.env.DIALECT || 'mysql';

  static timezoneTest = process.env.TIMEZONE || 'Asia/Seoul';

  static readTest = process.env.READ;

  static writeTest = process.env.WRITE;

  static charsetTest = process.env.CHARSET || 'utf8';

  static poolMinTest = process.env.POOL_MIN || 0;

  static poolMaxTest = process.env.POOL_MAX || 0;

  static port = process.env.port || 3000;

  static getDBConfig() {
    return {
      name: this.dbName,
      user: this.user,
      password: this.password,
      dialect: this.dialect,
      timezone: this.timezone,
      read: this.read,
      write: this.write,
      charset: this.charset,
      poolMin: this.poolMin,
      poolMax: this.poolMax,
    };
  }

  static getTestDBConfig() {
    return {
      name: this.dbNameTest,
      user: this.userTest,
      password: this.passwordTest,
      dialect: this.dialectTest,
      timezone: this.timezoneTest,
      read: this.readTest,
      write: this.writeTest,
      charset: this.charsetTest,
      poolMin: this.poolMinTest,
      poolMax: this.poolMaxTest,
    };
  }

  static getPort() : number {
    return Number(this.port);
  }
}
