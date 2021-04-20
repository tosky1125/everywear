import express from 'express';
import header from './infra/util/header';
import UserController from './user/UserController';
import { ApplicationConfig } from './infra/ApplicationConfig';

const app = express();
const port = ApplicationConfig.getPort();
app.use(header());

app.use(UserController.getRouter());

app.listen(port, () => {
  console.log(`App is Listening to Port ${port}`);
});
