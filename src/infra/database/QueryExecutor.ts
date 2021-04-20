import { Knex, knex } from 'knex';
import knexConfig from './knexfile';

export class QueryExecutor {
  static instance : QueryExecutor;

  private connection: Knex;

  private readConnection: Knex;

  static getInstance() {
    return this.instance;
  }

  constructor() {
    this.connection = knex(knexConfig().test);
    this.readConnection = this.connection;
  }

  getWriteConnection = () : Knex => this.connection;

  getReadConnection = () : Knex => this.readConnection;
}
