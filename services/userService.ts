import User from '../models/User';
import mongoose from 'mongoose';
import { hashPassword } from '../utils/passwordUtils';

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  
  return users.map(user => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    return null;
  }

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const createUser = async (data: CreateUserData): Promise<UserResponse> => {
  const { name, email, password, role = 'user' } = data;

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (role && !['user', 'admin'].includes(role)) {
    throw new Error('Role must be either "user" or "admin"');
  }

  // Check if user with same email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });

  await user.save();

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<UserResponse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  // Validate role if provided
  if (data.role && !['user', 'admin'].includes(data.role)) {
    throw new Error('Role must be either "user" or "admin"');
  }

  // Validate password if provided
  if (data.password !== undefined && data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Check email uniqueness if updating email
  if (data.email && data.email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
  }

  // Update fields
  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email.toLowerCase();
  if (data.role !== undefined) user.role = data.role as 'user' | 'admin';
  if (data.password !== undefined) {
    user.password = await hashPassword(data.password);
  }

  await user.save();

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(id);
};
