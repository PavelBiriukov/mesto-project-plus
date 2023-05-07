import { model, Schema } from 'mongoose';
import { regExp } from '../constants/index';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'User name required'],
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: [true, 'User about required'],
  },
  avatar: {
    type: String,
    required: [true, 'User avatar required'],
    validate: {
      validator: (v: string) => regExp.test(v),
      message: 'Некорректная ссылка',
    },
  },
});
export default model<IUser>('User', UserSchema);
