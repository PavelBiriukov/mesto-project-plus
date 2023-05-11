import { Request, Response, NextFunction } from 'express';
import Card from '../models/cards';


export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate(['owner', 'likes'])
  .then((card: any) => res.send(card))
  .catch(next);

export const createCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const _id = req.user?._id;

  Card.create({ name, link, owner: _id })
    .then((card: any) => res.status(201).send(card))
    .catch((err: any) => {
      next(err)

    });
};

export const deleteCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const _id = req.params.cardId;
  const userId = req.user?._id;
  return Card.findById(_id)
    .then((card: { owner: { toString: () => any; }; deleteOne: () => Promise<any>; }) => {
      if (!card) {
        next()
      }
      if (card.owner.toString() === userId) {
        return card.deleteOne()
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch((err: any) => {
            next(err)
          });
      }
      next()
    })
    .catch((err: any) => {
      next(err)
    });
};

export const addLikeCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const _id = req.user?._id;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card: any) => {
      if (!card) {
        next()

      }
      return res.send(card);
    })
    .catch((err: any) => {
      next(err)

    });
};

export const deleteLikeCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const _id = req.user?._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((updatedCard: any) => {
      if (!updatedCard) {
        next()

      }
      return res.send(updatedCard);
    })
    .catch((err: any) => {
      next(err)
    });
};
