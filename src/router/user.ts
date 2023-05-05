import { Router } from 'express';
const userController = require('../controllers/user-controller');


const router = Router();

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.patch('/me', userController.updateInfo);
router.patch('/me/avatar', userController.updateAvatar);

export default router;