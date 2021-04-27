import express from 'express';
import bodyParser from 'body-parser';
import header from './infra/util/header';
import UserController from './user/UserController';
import { ApplicationConfig } from './infra/ApplicationConfig';
import AuthController from './auth/AuthController';
import passport from './infra/passport/passport';
import FileController from './file/FileController';

const index = express();
const port = ApplicationConfig.getPort();
index.use(header());
index.use(bodyParser.json({ limit: 1024 * 1024 * 50, type: 'application/json' }));
index.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 50, type: 'application/x-www-form-urlencoded' }));
index.use(passport.initialize());
index.use(UserController.getRouter());
index.use(AuthController.getRouter());
index.use(FileController.getRouter());

index.listen(port, () => {
  console.log(`App is Listening to Port ${port}`);
});
