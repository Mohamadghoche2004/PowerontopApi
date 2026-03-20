import { Request, Response } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/userService';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch users' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to fetch user' });
  }
};

export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create user' });
  }
};

export const updateUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const user = await updateUser(id, req.body);
    res.status(200).json(user);
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to update user' });
    }
  }
};

export const deleteUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteUser(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to delete user' });
    }
  }
};
