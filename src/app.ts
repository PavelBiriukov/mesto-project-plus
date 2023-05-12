/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandlingMiddleware';
import userController from './controllers/userController';
import authMiddleware from './middleware/authMiddleware';
import { createUserValidation, loginValidation } from './validation/userValidation';
import { requestLogger } from './middleware/logger';
import { errorLogger } from './middleware/errorLogger';

require('dotenv').config();

const PORT = process.env.PORT || 5003;
const DBURL = process.env.DB_URL || 'mongodb://localhost:27017/mestodb';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', loginValidation, userController.login);
app.post('/signup', createUserValidation, userController.createUser);
app.use(authMiddleware);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(`${DBURL}`);

    app.listen(
      PORT,
      () => console.log(`Server start ${PORT}`),
    );
  } catch (e) {
    console.log(e);
  }
};

start();
