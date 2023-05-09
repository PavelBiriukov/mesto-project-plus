import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} from '../controllers/cards';
import { idCardValidate, createCardValidate } from '../services/validation';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidate, createCard);
router.delete('/:cardId', idCardValidate, deleteCard);
router.put('/:cardId/likes', idCardValidate, addLikeCard);
router.delete('/:cardId/likes', idCardValidate, deleteLikeCard);

export default router;
