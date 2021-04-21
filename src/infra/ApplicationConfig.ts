export class ApplicationConfig {
  private static dbName = process.env.NAME || 'everywhere';

  private static user = process.env.dbUser || 'admin';

  private static password = process.env.PASSWORD || 'tmflfkd1!';

  private static dialect = process.env.DIALECT || 'mysql';

  public static S3FilesPath = process.env.S3_FILES_PATH || 'files';

  public static S3Bucket = process.env.S3_BUCKET || 'everywear-image';

  private static timezone = process.env.TIMEZONE || 'Asia/Seoul';

  private static read = process.env.READ || 'everywhere-dev.cond05qp242q.ap-northeast-2.rds.amazonaws.com';

  private static write = process.env.WRITE || 'everywhere-dev.cond05qp242q.ap-northeast-2.rds.amazonaws.com' ;

  private static charset = process.env.CHARSET || 'utf8';

  private static poolMin = process.env.POOL_MIN || 0;

  private static poolMax = process.env.POOL_MAX || 0;

  private static dbNameTest = process.env.NAME || 'everywear';

  private static userTest = process.env.USER || 'admin';

  private static passwordTest = process.env.PASSWORD || 'everywear2021!@';

  private static dialectTest = process.env.DIALECT || 'mysql';

  private static timezoneTest = process.env.TIMEZONE || 'Asia/Seoul';

  private static readTest = process.env.READ;

  private static writeTest = process.env.WRITE;

  private static charsetTest = process.env.CHARSET || 'utf8';

  private static poolMinTest = process.env.POOL_MIN || 0;

  private static poolMaxTest = process.env.POOL_MAX || 0;

  private static port = process.env.port || 3000;

  private static jwtSecret = process.env.jwtSecret || 'everywear';

  private static mailAddress = process.env.MailAddress || 'everywear33@gmail.com';

  private static mailPass = process.env.MailPass || 'teameverywear2021';

  private static randomPasswordLength = 20;

  private static mailHost = 'smtp.gmail.com';

  private static mailService = 'gmail';

  private static mailPort = '587';

  private static awsAccessKey = process.env.AWS_ACCESS_KEY || 'AKIAVZGJ7YYKYR2KAEEP';

  private static awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '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';

  static getS3Bucket() {
    return this.S3Bucket;
  }

  static getS3FilePath() {
    return this.S3FilesPath;
  }

  static getAwsKey() {
    return {
      accessKey: this.awsAccessKey,
      secretKey: this.awsSecretAccessKey,
    };
  }

  static getMailHost() {
    return this.mailHost;
  }

  static getMailService() {
    return this.mailService;
  }

  static getMailPort() {
    return this.mailPort;
  }

  static getRandomPasswordLength() {
    return this.randomPasswordLength;
  }

  static getMailAddress() {
    return this.mailAddress;
  }

  static getMailPassword() {
    return this.mailPass;
  }

  static getJwtSecret() {
    return this.jwtSecret;
  }

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
