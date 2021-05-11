import express from 'express';
import bodyParser from 'body-parser';
import header from './infra/util/header';
import UserController from './user/UserController';
import { ApplicationConfig } from './infra/ApplicationConfig';
import AuthController from './auth/AuthController';
import passport from './infra/passport/passport';
import FileController from './file/FileController';
import EvaluationController from './evaluation/EvaluationController';
import AdminController from './admin/AdminController';

const app = express();
const port = ApplicationConfig.getPort();
app.use(header());
app.use(bodyParser.json({ limit: 1024 * 1024 * 200, type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 200, type: 'application/x-www-form-urlencoded' }));
app.use(passport.initialize());
app.use(UserController.getRouter());
app.use(AuthController.getRouter());
app.use(FileController.getRouter());
app.use(EvaluationController.getRouter());
app.use(AdminController.getRouter());
app.listen(port, () => {
  console.log(`App is Listening to Port ${port}`);
});
