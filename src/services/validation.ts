import { Joi, celebrate } from 'celebrate';
import {
  regexUrlSchema, regexDescribeSchema, regexEmailSchema, regexUserSchema, regexIdSchema, urlRegex,
} from './constants';

const signinSchema = Joi.object().keys({
  email: regexEmailSchema,
  password: Joi.string().required().min(8),
});

const singnupSchema = Joi.object().keys({
  name: regexUserSchema,
  about: regexUserSchema,
  avatar: Joi.string().pattern(urlRegex),
  email: regexEmailSchema,
  password: Joi.string().required().min(8),
});

const userByIdSchema = Joi.object().keys({
  userId: regexIdSchema,
});
const updateUserSchema = Joi.object().keys({
  name: regexDescribeSchema,
  about: Joi.string().required().min(2).max(200),
});
const updateAvatarSchema = Joi.object().keys({
  avatar: regexUrlSchema,
});

const createCardSchema = Joi.object().keys({
  name: regexDescribeSchema,
  link: regexUrlSchema,
});
const idCardSchema = Joi.object().keys({
  userId: regexIdSchema,
});

export const signinValidate = celebrate({ body: signinSchema });
export const signupValidate = celebrate({ body: singnupSchema });

export const getUserByIdValidate = celebrate({ params: userByIdSchema });
export const updateUserValidate = celebrate({ body: updateUserSchema });
export const updateAvatarValidate = celebrate({ body: updateAvatarSchema });

export const createCardValidate = celebrate({ body: createCardSchema });
export const idCardValidate = celebrate({ params: idCardSchema });
