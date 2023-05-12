import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';
import { getUserByIdValidate, updateUserValidate, updateAvatarValidate } from '../services/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserByIdValidate, getUserById);
router.patch('/me', updateUserValidate, updateUser);
router.patch('/me/avatar', updateAvatarValidate, updateAvatar);

export default router;
