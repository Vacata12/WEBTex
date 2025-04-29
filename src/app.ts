import express from 'express';
import mongoose from 'mongoose';
import { createUser, getUserById, updateUser, deleteUser } from './controllers/userController';
import { createStorageQuota, getStorageQuotaByUserId, updateStorageQuota, deleteStorageQuota } from './controllers/strorageController';
import { createFile, getFileById, updateFile, deleteFile } from './controllers/fileController';
import dbConfig from './config/db';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err });
  });

mongoose.connect(dbConfig.connectionString, dbConfig.options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection failed', err);
  });

app.post('/users', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  try {
    const newUser = await createUser({ firstName, lastName, username, email, password });
    await createStorageQuota(newUser._id, 'free'); // Създаване на квота
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedUser = await updateUser(userId, updatedData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// Рутове за файлове
app.post('/files', async (req, res) => {
  const { name, type, path, owner, parent, isPublic, originalName } = req.body;
  try {
    const newFile = await createFile({ name, type, path, owner, parent, isPublic, originalName });
    res.status(201).json(newFile);
  } catch (error) {
    res.status(400).json({ message: 'Error creating file', error });
  }
});

app.get('/files/:id', async (req, res) => {
  const fileId = req.params.id;
  try {
    const file = await getFileById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file', error });
  }
});

app.put('/files/:id', async (req, res) => {
  const fileId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedFile = await updateFile(fileId, updatedData);
    if (!updatedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(updatedFile);
  } catch (error) {
    res.status(400).json({ message: 'Error updating file', error });
  }
});

app.delete('/files/:id', async (req, res) => {
  const fileId = req.params.id;
  try {
    const deletedFile = await deleteFile(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
