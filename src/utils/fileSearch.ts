// ...file search logic for MongoDB-like file objects...

export interface FileNode {
  _id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  owner: string;
  isPublic: boolean;
  mimeType?: string;
  size?: number;
  lastModified: string;
  originalName: string;
  parent?: string;
}

export interface SearchResult {
  _id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  owner: string;
  size?: number;
  mimeType?: string;
  lastModified: string;
  originalName: string;
}

// Example mock data matching MongoDB schema
export const mockFiles: FileNode[] = [
  {
    _id: '1',
    name: 'nodemon.json',
    type: 'file',
    path: '/nodemon.json',
    owner: 'user1',
    isPublic: false,
    mimeType: 'application/json',
    size: 123,
    lastModified: new Date().toISOString(),
    originalName: 'nodemon.json',
  },
  {
    _id: '2',
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    owner: 'user1',
    isPublic: false,
    mimeType: 'application/json',
    size: 456,
    lastModified: new Date().toISOString(),
    originalName: 'package.json',
  },
  {
    _id: '3',
    name: 'public',
    type: 'directory',
    path: '/public',
    owner: 'user1',
    isPublic: false,
    lastModified: new Date().toISOString(),
    originalName: 'public',
  },
  {
    _id: '4',
    name: 'index.ts',
    type: 'file',
    path: '/public/index.ts',
    owner: 'user1',
    isPublic: false,
    mimeType: 'text/typescript',
    size: 789,
    lastModified: new Date().toISOString(),
    originalName: 'index.ts',
    parent: '3',
  },
  {
    _id: '5',
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    owner: 'user1',
    isPublic: true,
    mimeType: 'text/markdown',
    size: 100,
    lastModified: new Date().toISOString(),
    originalName: 'README.md',
  },
];

export function searchFiles(files: FileNode[], pattern: string): SearchResult[] {
  const searchTerm = pattern.trim().toLowerCase();
  if (!searchTerm) return [];

  // Check if the search term contains a '/'
  if (searchTerm.includes('/')) {
    // Filter by full path
    return files.filter(file => file.path.toLowerCase().includes(searchTerm));
  }

  // Default: Filter by file name
  return files.filter(file => file.name.toLowerCase().includes(searchTerm));
}
