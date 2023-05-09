import { Joi } from 'celebrate';

export const STATUS_BAD_REQUEST = 400;
export const STATUS_UNAUTHORIZED_ERROR = 401;
export const STATUS_FORBIDDEN = 403;
export const STATUS_NOT_FOUND = 404;
export const STATUS_ALREADY_EXIST_ERROR = 409;
export const STATUS_SERVER_ERROR = 500;

export const MSG_ERROR_INVALID_DATA = 'Переданы некорректные данные';
export const MSG_ERROR_GENERIC = 'На сервере произошла ошибка';
export const MSG_ERROR_UNAUTHORIZED = 'Требуется авторизация';
export const MSG_ERROR_NOT_FOUND = 'Требуется авторизация';

export const MSG_CARD_NOT_FOUND = 'Карточка не найдена';
export const MSG_CARD_DELETED = 'Карточка успешно удалена';
export const MSG_ERROR_FORBIDDEN = 'Это не ваша карточка, вы не можете её удалить';

export const MSG_ERROR_USER_NOT_FOUND = 'Пользователь не найден';
export const MSG_ERROR_USER_ALREADY_EXIST = 'Пользователь уже существует';

export const VALIDATION_ERROR = 'ValidationError';
export const OBJECT_ID = 'ObjectId';
export const CAST_ERROR = 'CastError';

export const defaultUserName = 'Жак-Ив Кусто';
export const defaultUserAbout = 'Исследователь';
export const defaultUserAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

export const MSG_ERROR_USER_PASS_WRONG = 'Неправильный логин или пароль';

export const urlRegex = /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
export const regexUrlSchema = Joi.string().required().pattern(urlRegex);
export const regexDescribeSchema = Joi.string().required().min(2).max(30);
export const regexEmailSchema = Joi.string().email();
export const regexUserSchema = Joi.string().min(3).max(30);
export const regexIdSchema = Joi.string().required().hex().length(24);
