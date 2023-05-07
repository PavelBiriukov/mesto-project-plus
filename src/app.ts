require('dotenv').config()
import express, { NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandlingMiddleware';
import { requestIdHandler } from './types/AppRequest';

const PORT = process.env.PORT || 5003

const app = express();
app.use(express.json());
app.use(requestIdHandler as express.RequestHandler);

app.use('/', router);

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);

    app.listen(PORT,
      () => console.log(`Server start ${PORT}`)
    )
  } catch (e) {
    console.log(e)
  }
}

start()