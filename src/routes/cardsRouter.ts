import { Router } from 'express';
import cardsController from '../controllers/cardsController';
import { createCardValidation, getCardValidation } from '../validation/cardValidation';

const router = Router();

router.get('/', cardsController.getAllCards);
router.post('/', createCardValidation, cardsController.createCard);
router.delete('/:cardId', getCardValidation, cardsController.removeCard);

router.put('/:cardId/likes', getCardValidation, cardsController.likeCard);
router.delete('/:cardId/likes', getCardValidation, cardsController.dislikeCard);

export default router;
