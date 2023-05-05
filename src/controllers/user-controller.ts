import user from "../models/user";

const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req: { body: { email: any; password: any; }; }, res: { cookie: (arg0: string, arg1: any, arg2: { maxAge: number; httpOnly: boolean; }) => void; json: (arg0: any) => any; }, next: (arg0: any) => void) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req: { body: { email: any; password: any; }; }, res: { cookie: (arg0: string, arg1: any, arg2: { maxAge: number; httpOnly: boolean; }) => void; json: (arg0: any) => any; }, next: (arg0: any) => void) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req: { cookies: { refreshToken: any; }; }, res: { clearCookie: (arg0: string) => void; json: (arg0: any) => any; }, next: (arg0: any) => void) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req: { params: string; }, res: { redirect: (arg0: string | undefined) => any; }, next: (arg0: any) => void) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: { cookies: { refreshToken: any; }; }, res: { cookie: (arg0: string, arg1: any, arg2: { maxAge: number; httpOnly: boolean; }) => void; json: (arg0: any) => any; }, next: (arg0: any) => void) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req: any, res: { json: (arg0: any) => any; }, next: (arg0: any) => void) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
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
