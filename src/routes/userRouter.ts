import { Router } from 'express';
import userController from '../controllers/userController';
import { updateInfoValidation, updateAvatarValidation } from '../validation/userValidation';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/me', userController.getUserInfo);

router.get('/:id', userController.getUserById);
router.patch('/me', updateInfoValidation, userController.updateInfo);
router.patch('/me/avatar', updateAvatarValidation, userController.updateAvatar);

export default router;
