import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';


/* eslint no-param-reassign: "off" */
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user: { password: string; _id: any; }) => {
      bcrypt.compare(password, user.password).then((correct: any) => {
        const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
          expiresIn: '7d',
        });
        user.password = '';
        res.cookie('jwt', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'strict',
        })
          .send(user);
      });
    })
    .catch(next);
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .then((user: any) => res.send(user))
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params.userId)
    .then((user: any) => {
      if (!user) {
        next()
      }
      return res.send(user);
    })
    .catch((err: any) => {
      next(err)
    });
};

export const getCurrentUser = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction,
) => {
  const _id = req.user?._id;
  return User.findById(_id)
    .then((user: any) => {
      if (!user) {
        next(user)
      }
      return res.send(user);
    })
    .catch((err: any) => {
      next(err)
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash: any) => User.create({
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
    .catch((err: any) => {
      next(err)
    });
};

export const updateUser = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const _id = req.user?._id;
  return User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user: any) => {
      if (!user) {
        next(user)
      }
      return res.send(user);
    })
    .catch((err: any) => {
      next(err)
    });
};

export const updateAvatar = (
  req: IRequestCustom,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const _id = req.user?._id;
  return User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user: any) => {
      if (!user) {
        next('err')
      }
      return res.send(user);
    })
    .catch((err: any) => {
      next(err)
    });
};
