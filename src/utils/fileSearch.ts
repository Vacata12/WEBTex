import { IFile } from "../models/fileModel"; // Import the IFile interface
import mongoose from "mongoose"; // Import mongoose for ObjectId type

// Example mock data matching MongoDB schema
export const mockFiles: Partial<IFile>[] = [
  {
    _id: '1',
    name: 'nodemon.json',
    type: 'file',
    path: '/nodemon.json',
    owner: new mongoose.Types.ObjectId(),
    isPublic: false,
    mimeType: 'application/json',
    size: 123,
    lastModified: new Date(),
    originalName: 'nodemon.json',
    storageUrl: undefined,
    sharedWith: [],
    starred: false,
  },
  {
    _id: '2',
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    owner: new mongoose.Types.ObjectId(),
    isPublic: false,
    mimeType: 'application/json',
    size: 456,
    lastModified: new Date(),
    originalName: 'package.json',
    storageUrl: undefined,
    sharedWith: [],
    starred: false,
  },
  {
    _id: '3',
    name: 'public',
    type: 'directory',
    path: '/public',
    owner: new mongoose.Types.ObjectId(),
    isPublic: false,
    lastModified: new Date(),
    originalName: 'public',
    storageUrl: undefined,
    sharedWith: [],
    starred: false,
  },
  {
    _id: '4',
    name: 'index.ts',
    type: 'file',
    path: '/public/index bimbim.ts',
    owner: new mongoose.Types.ObjectId(),
    isPublic: false,
    mimeType: 'text/typescript',
    size: 789,
    lastModified: new Date(),
    originalName: 'index.ts',
    parent: new mongoose.Types.ObjectId(),
    storageUrl: undefined,
    sharedWith: [],
    starred: false,
  },
  {
    _id: '5',
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    owner: new mongoose.Types.ObjectId(),
    isPublic: true,
    mimeType: 'text/markdown',
    size: 100,
    lastModified: new Date(),
    originalName: 'README.md',
    storageUrl: undefined,
    sharedWith: [],
    starred: false,
  },
];

export function searchFiles(files: Partial<IFile>[], pattern: string): Partial<IFile>[] {
  const searchTerm = pattern.trim().toLowerCase();
  if (!searchTerm) return [];

  // Check if the search term contains a '/'
  if (searchTerm.includes('/')) {
    // Filter by full path
    return files.filter(file => file.path?.toLowerCase().includes(searchTerm));
  }

  // Default: Filter by file name
  return files.filter(file => file.name?.toLowerCase().includes(searchTerm));
}
