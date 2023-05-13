import { Joi, celebrate } from 'celebrate';
import { REGEX_URL } from '../constants';

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().pattern(REGEX_URL),
  }),
});

export const getCardValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
