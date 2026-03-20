import express from 'express';
import {
  getAllUsers,
  getUser,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUserHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;
