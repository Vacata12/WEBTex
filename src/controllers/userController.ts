import User from '../models/userModel';
import bcrypt from 'bcrypt';

// Създаване на потребител (Create)
export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({
    ...userData,
    password: hashedPassword,
  });
  return await user.save();
};

export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};

export const updateUser = async (userId: string, updatedData: object) => {
  return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};

export const deleteUser = async (userId: string) => {
  return await User.findByIdAndDelete(userId);
};
