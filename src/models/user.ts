import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    default: '',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: '',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    default: '',
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
    validate: '',
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default model('user', userSchema);
