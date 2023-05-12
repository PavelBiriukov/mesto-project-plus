import { Schema, model } from 'mongoose';
import { defaultUserAbout, defaultUserAvatar, defaultUserName } from '../services/constants';
import { IUser } from '../services/interfaces';
import { emailValidator } from '../services/index';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    default: defaultUserName,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: defaultUserAbout,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: defaultUserAvatar,
    validate: {
      validator(v: string) {
        return /^(http|https):\/\/(?:www\.|(?!www))[^ "]+\.([a-z]{2,})/.test(v);
      },
      message: 'URL не соответствует формату',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidator,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default model('user', userSchema);
