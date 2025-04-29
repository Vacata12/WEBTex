import File from '../models/fileModel';

export const createFile = async (fileData: {
  name: string;
  type: string;
  path: string;
  owner: string;
  parent: string | null;
  isPublic: boolean;
  originalName: string;
}) => {
  const file = new File(fileData);
  return await file.save();
};

export const getFileById = async (fileId: string) => {
  return await File.findById(fileId);
};

export const updateFile = async (fileId: string, updatedData: object) => {
  return await File.findByIdAndUpdate(fileId, updatedData, { new: true });
};

export const deleteFile = async (fileId: string) => {
  return await File.findByIdAndDelete(fileId);
};
