import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import ApiError from '../error/ApiError';
/* НЕ нашел в чек листе: что Контроллеры должны быть описаны не в виде класса, а в виде отдельных функций. */
/* извините но я не понял : Согласно требованиям к этой работе вам необходимо вынести все коды ответов в константы.
Рекомендую использовать константы из пакета http2, который встроен в NodeJS. */
/* У ребят из моей и чужих когорт похожий код но им про эту ошибку не говорили:
Во время работы приложения в контроллерах могут возникать различные ошибки БД,
 которые нужно обрабатывать. Чтобы вам было проще разобраться, я добавлю справку
 по ошибкам БД в конец общего комментария. Обратите внимание, что в каждом контроллере
 не нужно обрабатывать все возможные ошибки — обрабатывайте только те,
что могут возникать в конкретном контроллере. */
class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { name, about, avatar } = req.body;

    try {
      if (!name || !about || !avatar) {
        return next(ApiError.badRequest('Переданы некорректные данные при создании пользователя'));
      }
      const user = await User.create({ name, about, avatar });
      return res.json({ data: user });
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