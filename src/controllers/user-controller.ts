import user from "../models/user";

const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {

    async createUser(req: any, res: any, next: any) {
        const { name, about, avatar } = req.body;

        try {
          if (!name || !about || !avatar) {
            return next(ApiError.badRequest('Переданы некорректные данные при создании пользователя'));
          }
          const CreatUser = await user.create({ name, about, avatar });
          return res.json({ data: CreatUser });
        } catch {
          next(ApiError.internal('На сервере произошла ошибка'));
        }
      }

      async getAllUsers(req: any, res: any, next: any) {
        try {
          const users = await user.find({});
          return res.json({ data: users });
        } catch {
          next(ApiError.internal('На сервере произошла ошибка'));
        }
      }

      async getUserById(req: any, res: any, next: any) {
        const { id } = req.params;
        try {
          const users = await user.findById(id);
          if (!users) {
            return next(ApiError.authorization('Пользователь по указанному _id не найден'));
          }
          return res.json({ data: users });
        } catch {
          next(ApiError.internal('На сервере произошла ошибка'));
        }
      }

      async updateInfo(req: any, res: any, next: any) {
        const { name, about } = req.body;
        const id = req.user!._id;
        try {
          if (!name || !about) {
            return next(ApiError.badRequest('Переданы некорректные данные при обновлении профиля'));
          }

          const users = await user.findByIdAndUpdate(
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

      async updateAvatar(req: any, res: any, next: any) {
        const { avatar } = req.body;
        const id = req.user!._id;
        try {
          if (!avatar) {
            return next(ApiError.badRequest('Переданы некорректные данные при обновлении аватара'));
          }
          const users = await user.findByIdAndUpdate(
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


module.exports = new UserController();
