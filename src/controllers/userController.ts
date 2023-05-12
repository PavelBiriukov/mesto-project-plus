import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import ApiError from '../error/ApiError';
import { IAppRequest } from '../types/AppRequest';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name = 'Жак-Ив Кусто',
      about = 'Исследователь',
      avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      email,
      password,
    } = req.body;

    try {
      if (!email || !password) {
        return next(ApiError.badRequest('Переданы некорректные данные при создании пользователя'));
      }
      const candidate = await User.findOne({ email });
      if (candidate) {
        return next(ApiError.conflict('Пользователь с переданным email уже существует'));
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, about, avatar, email, password: hashPassword,
      });
      return res.send({
        data:
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.json({ data: users });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const users = await User.findById(id);
      if (!users) {
        return next(ApiError.authorization('Пользователь по указанному _id не найден'));
      }
      return res.json({ data: users });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }

  async getUserInfo(req: IAppRequest, res: Response, next: NextFunction) {
    const userId = req.user!._id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return next(ApiError.authorization('Пользователь по указанному _id не найден'));
      }
      res.send({ data: user });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }

  async login(req: IAppRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);
      return res.send({
        token: jwt.sign({ _id: user._id }, process.env.SECRET_KEY as string || 'G0OSxv4FFzqX1O1KbkFaWmVVTW4kbWyI', { expiresIn: '7d' }),
      });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }

  async updateInfo(req: any, res: Response, next: NextFunction) {
    const { name, about } = req.body;
    const id = req.user!._id;
    try {
      if (!name || !about) {
        return next(ApiError.badRequest('Переданы некорректные данные при обновлении профиля'));
      }

      const users = await User.findByIdAndUpdate(
        id,
        {
          name,
          about,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!users) {
        return next(ApiError.authorization('Пользователь по указанному _id не найден'));
      }
      return res.json({ data: users });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }

  async updateAvatar(req: any, res: Response, next: NextFunction) {
    const { avatar } = req.body;
    const id = req.user!._id;
    try {
      if (!avatar) {
        return next(ApiError.badRequest('Переданы некорректные данные при обновлении аватара'));
      }
      const users = await User.findByIdAndUpdate(
        id,
        {
          avatar,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!users) {
        return next(ApiError.authorization('Пользователь по указанному _id не найден'));
      }
      return res.json({ data: users });
    } catch {
      next(ApiError.internal('На сервере произошла ошибка'));
    }
  }
}
export default new UserController();
