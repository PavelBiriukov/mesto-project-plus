import ApiError from '../exceptions/api-error';
import Card from '../models/card';
import { IAppRequest } from '../types/AppRequest';

class CardController {
  async createCard(req: any, res: any, next: any) {
    const { name, link } = req.body;
    const owner = req.user!._id;

    try {
      if (!name || !link) {
        return next(ApiError.BadRequest('Переданы некорректные данные при создании карточки'));
      }
      const user = await Card.create({ name, link, owner });
      return res.json({ data: user });
    } catch {
      next(ApiError.BadRequest('На сервере произошла ошибка'));
    }
  }

  async getAllCards(req: any, res: any, next: any) {
    try {
      const cards = await Card.find({});
      return res.json({ data: cards });
    } catch {
      next(ApiError.BadRequest('На сервере произошла ошибка'));
    }
  }

  async removeCard(req: IAppRequest, res: any, next: any) {
    const { cardId } = req.params;

    try {
      await Card.findByIdAndRemove(cardId)
        .then((card) => {
          if (!card) {
            return next(ApiError.BadRequest('Карточка с указанным _id не найдена'));
          }
          return res.json({ data: card });
        });
    } catch {
      next(ApiError.BadRequest('На сервере произошла ошибка'));
    }
  }

  async likeCard(req: IAppRequest, res: any, next: any) {
    const { cardId } = req.params;
    const id = req.user!._id;

    try {
      if (!cardId) {
        return next(ApiError.BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $addToSet: {
            likes: id,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!card) {
        return next(ApiError.BadRequest('Передан несуществующий _id карточки'));
      }
      return res.json({ data: card });
    } catch {
      next(ApiError.BadRequest('На сервере произошла ошибка'));
    }
  }

  async dislikeCard(req: IAppRequest, res: any, next: any) {
    const { cardId } = req.params;
    const id = req.user!._id;

    try {
      if (!cardId) {
        return next(ApiError.BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $pull: {
            likes: id,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!card) {
        return next(ApiError.BadRequest('Передан несуществующий _id карточки'));
      }
      return res.json({ data: card });
    } catch {
      next(ApiError.BadRequest('На сервере произошла ошибка'));
    }
  }
}
export default new CardController();