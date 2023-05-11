import mongoose from 'mongoose';
import { errors } from 'celebrate';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { PORT = 3000, SERVER = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(SERVER);

app.use(errors());
app.listen(PORT);
