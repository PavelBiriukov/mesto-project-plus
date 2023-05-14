import {
  model, Schema, Model, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { emailValidator } from 'middleware/ErrorHandlingMiddleware';
import { REGEX_URL } from '../constants/index';
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

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => REGEX_URL.test(v),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User email equired'],
    validate: emailValidator,
  },
  password: {
    type: String,
    required: [true, 'User password required'],
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email, password) {
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

export default model<IUser, UserModel>('user', userSchema);
