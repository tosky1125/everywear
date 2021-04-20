import Debug from 'debug';

import Logger from '../Logger';
import { ApplicationConfig } from '../ApplicationConfig';

const error = Debug('error');
const info = Debug('info');
const {
  name,
  user,
  password,
  dialect,
  read1,
  read2,
  read3,
  read4,
  read5,
  write,
  charset,
  poolMin,
  poolMax,
} = ApplicationConfig.getDBConfig();

const testConfig = ApplicationConfig.getTestDBConfig();
const host = [write, read1, read2, read3, read4, read5].filter((e) => e);

const poolRange = {
  min: Number(poolMin),
  max: Number(poolMax),
};

const configs = host.map((e) => {
  const config = {
    client: dialect,
    connection: {
      database: name,
      user,
      password,
      charset,
      host: e,
      typeCast(field, next) {
        if (field.type == 'TINY' && field.length == 1) {
          const value = field.string();
          return value ? (value == '1') : null;
        }
        return next();
      },
    },
    pool: {
      afterCreate(conn, done) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="Asia/Seoul";', (err) => {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query('SELECT set_limit(0.01);', (err) => {
              // if err is not falsy, connection is discarded from pool
              // if connection aquire was triggered by a query the error is passed to query promise
              done(err, conn);
            });
          }
        });
      },
    },

    debug: true,
    log: {
      error(message: Error) {
        return Logger.error(message);
      },
      debug(message : string) {
        return Logger.info(message);
      },
    },
  };
  if (poolMin && poolMax) {
    config.pool = poolRange;
  } else {
    delete config.pool;
  }
  return config;
});

const knexConfig = () => ({
  test: {
    ...testConfig,
    useNullAsDefault: true,

    debug: true,
    log: {
      error(message: Error) {
        return error(message);
      },
      debug(message: string) {
        return info(message);
      },
    },
  },

  development: configs,

  production: configs,

});

export default knexConfig;
