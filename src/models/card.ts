import { model, Schema, Types } from 'mongoose';
import { REGEX_URL } from '../constants/index';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Types.ObjectId];
  createdAt: Date;
}

const CardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 30,
      message: 'Текст должен быть не короче 2 симв. и не длиннее 30',
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => REGEX_URL.test(v),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    ref: 'user',
    type: [Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default model<ICard>('Card', CardSchema);
