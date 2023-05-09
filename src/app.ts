import mongoose from 'mongoose';
import { errors } from 'celebrate';
import express from 'express';
import appRouter from './routes/index';
import authRouter from './routes/auth';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorMiddleware from './middlewares/errors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { PORT = 3000, SERVER = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(SERVER);

app.use(requestLogger);

app.use('/', authRouter);

app.use('/', auth, appRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorMiddleware);

app.listen(PORT);
