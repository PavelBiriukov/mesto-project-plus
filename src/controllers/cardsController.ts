import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError';
import Card from '../models/card';
import { IAppRequest } from '../types/AppRequest';
import errorHandler from 'middleware/ErrorHandlingMiddleware';

class CardController {
  async createCard(req: IAppRequest, res: Response, next: NextFunction) {
    const { name, link } = req.body;
    const owner = req.user!._id;

    try {
      const user = await Card.create({ name, link, owner });
      return res.json({ data: user });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async getAllCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await Card.find({});
      return res.json({ data: cards });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async deleteCard (req: IAppRequest, res: Response, next: NextFunction) {
    const _id = req.params.cardId;
    const userId = req.user?._id;
    return Card.findById(_id)
      .then((card) => {
        if (!card) {
          return next(ApiError.authorization('Карточка с указанным _id не найдена'));
        }
        if (card.owner.toString() === userId) {
          return card.deleteOne()
            .then(() => res.send({ message: 'Карточка успешно удалена' }))
            .catch((err: any) => {
              errorHandler(err, req, res)
            });
          }
        return next(ApiError.authorization('Недостаточно прав для удаления карточки'));
      })
      .catch((err: any) => {
        errorHandler(err, req, res)
      });
  };

  async likeCard(req: IAppRequest, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const id = req.user!._id;

    try {
      if (!cardId) {
        return next(ApiError.badRequest('Переданы некорректные данные для постановки лайка'));
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
        },
      );
      if (!card) {
        return next(ApiError.notFound('Передан несуществующий _id карточки'));
      }
      return res.json({ data: card });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }

  async dislikeCard(req: IAppRequest, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    const id = req.user!._id;

    try {
      if (!cardId) {
        return next(ApiError.badRequest('Переданы некорректные данные для постановки лайка'));
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
        },
      );
      if (!card) {
        return next(ApiError.notFound('Передан несуществующий _id карточки'));
      }
      return res.json({ data: card });
    } catch(err: any) {
      errorHandler(err, req, res)
    }
  }
}
export default new CardController();
