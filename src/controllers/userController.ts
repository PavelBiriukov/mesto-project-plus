import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { handleOperationalErrors } from 'middleware/ErrorHandlingMiddleware';
import User from '../models/user';
import ApiError from '../error/ApiError';
import { IAppRequest } from '../types/AppRequest';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name, about, avatar, email,
    } = req.body;
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then(() => {
        res.status(201).send({
          name,
          about,
          avatar,
          email,
        });
      })
      .catch((err) => {
        handleOperationalErrors(err, next);
      });
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({});
      return res.json({ data: users });
    } catch (err) {
      handleOperationalErrors(err, next);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const users = await User.findById(id);

      return res.json({ data: users });
    } catch (err) {
      handleOperationalErrors(err, next);
    }
  }

  async getUserInfo(req: IAppRequest, res: Response, next: NextFunction) {
    const userId = req.user!._id;
    try {
      const user = await User.findById(userId);
      res.send({ data: user });
    } catch (err) {
      handleOperationalErrors(err, next);
    }
  }

  async login(req: IAppRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);
      return res.send({
        token: jwt.sign({ _id: user._id }, process.env.SECRET_KEY as string || 'G0OSxv4FFzqX1O1KbkFaWmVVTW4kbWyI', { expiresIn: '7d' }),
      });
    } catch (err) {
      handleOperationalErrors(err, next);
    }
  }

  async updateInfo(req, res: Response, next: NextFunction) {
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
      return res.json({ data: users });
    } catch (err) {
      handleOperationalErrors(err, next);
    }
  }

  async updateAvatar(req, res: Response, next: NextFunction) {
    const { avatar } = req.body;
    const id = req.user!._id;
    try {
      const users = await User.findByIdAndUpdate(
        id,
        {
          avatar,
        },
        {
          new: true,
        },
      );
      return res.json({ data: users });
    } catch (err) {
      handleOperationalErrors(err, next);
    }
  }
}
export default new UserController();
