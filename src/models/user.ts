import {
  model, Schema, Model, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { regExp } from '../constants/index';
import ApiError from '../error/ApiError';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<any, any, IUser>>
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 30,
      message: 'Текст должен быть не короче 2 симв. и не длиннее 30',
    },
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 200,
      message: 'Текст должен быть не короче 2 симв. и не длиннее 200',
    },
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => regExp.test(v),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User email equired'],
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'User password required'],
    select: false,
  },
});

UserSchema.static('findUserByCredentials', async function findUserByCredentials(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return ApiError.authorization('Неправильные почта или пароль');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return ApiError.authorization('Неправильные почта или пароль');
  }
  return user;
});

export default model<IUser, UserModel>('User', UserSchema);
