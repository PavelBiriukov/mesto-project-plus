import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import ApiError from '../error/ApiError';
import { IAppRequest } from '../types/AppRequest';
import errorHandler from 'middleware/ErrorHandlingMiddleware';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    try {
      const candidate = await User.findOne({ email });
      if (candidate) {
        return next(ApiError.notFound('Пользователь с переданным email уже существует'));
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
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.json({ data: users });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const users = await User.findById(id);
      if (!users) {
        return next(ApiError.notFound('Пользователь по указанному _id не найден'));
      }
      return res.json({ data: users });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async getUserInfo(req: IAppRequest, res: Response, next: NextFunction) {
    const userId = req.user!._id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return next(ApiError.notFound('Пользователь по указанному _id не найден'));
      }
      res.send({ data: user });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async login(req: IAppRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);
      return res.send({
        token: jwt.sign({ _id: user._id }, process.env.SECRET_KEY as string || 'G0OSxv4FFzqX1O1KbkFaWmVVTW4kbWyI', { expiresIn: '7d' }),
      });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async updateInfo(req: any, res: Response, next: NextFunction) {
    const { name, about } = req.body;
    const id = req.user!._id;
    try {
      const users = await User.findByIdAndUpdate(
        id,
        {
          name,
          about,
        },
        {
          new: true,
        },
      );
      if (!users) {
        return next(ApiError.notFound('Пользователь по указанному _id не найден'));
      }
      return res.json({ data: users });
    } catch(err: any) {
      errorHandler(err, req, res)
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
        },
      );
      if (!users) {
        return next(ApiError.notFound('Пользователь по указанному _id не найден'));
      }
      return res.json({ data: users });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }
}
export default new UserController();
