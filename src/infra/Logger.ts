import Debug from 'debug';

const log = Debug('log');
const error = Debug('error');
const info = Debug('info');

class Logger {
  public log = (message: any): void => {
    log(message);
  };

  public info = (message: any): void => {
    info(message);
  };

  public error = (err: Error): void => {
    error(err);
  };
}

export default new Logger();
