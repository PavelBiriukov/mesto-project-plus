import { Request, Response, NextFunction } from 'express';
import { IRequestCustom } from '../services/interfaces';
import Card from '../models/cards';
import {
  MSG_CARD_NOT_FOUND,
  MSG_CARD_DELETED,
  MSG_ERROR_FORBIDDEN,
} from '../services/constants';
import { handleOperationalErrors } from '../services/index';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';

export const getCards = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch(next);

export const createCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const _id = req.user?._id;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};

export const deleteCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const _id = req.params.cardId;
  const userId = req.user?._id;
  return Card.findById(_id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MSG_CARD_NOT_FOUND);
      }
      if (card.owner.toString() === userId) {
        return card.deleteOne()
          .then(() => res.send({ message: MSG_CARD_DELETED }))
          .catch((err) => {
            handleOperationalErrors(err, next);
          });
      }
      throw new ForbiddenError(MSG_ERROR_FORBIDDEN);
    })
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};

export const addLikeCard = (req: IRequestCustom, res: Response, next: NextFunction) => {
  const _id = req.user?._id;
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MSG_CARD_NOT_FOUND);
      }
      return res.send(card);
    })
    .catch((err) => {
      handleOperationalErrors(err, next);
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
    .then((updatedCard) => {
      if (!updatedCard) {
        throw new NotFoundError(MSG_CARD_NOT_FOUND);
      }
      return res.send(updatedCard);
    })
    .catch((err) => {
      handleOperationalErrors(err, next);
    });
};
