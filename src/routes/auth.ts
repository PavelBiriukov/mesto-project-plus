import { Router } from 'express';
import { signinValidate, signupValidate } from '../services/validation';
import { login, createUser } from '../controllers/users';

const router = Router();

router.post('/signin', signinValidate, login);
router.post('/signup', signupValidate, createUser);

export default router;
