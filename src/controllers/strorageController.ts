import StorageQuota from '../models/storageQuotaModel';
import dbConfig from '../config/db';

export const createStorageQuota = async (userId: string, plan: string) => {
  const quota = new StorageQuota({
    userId,
    totalSpace: dbConfig.storageQuotas[plan],
    usedSpace: 0,
    plan,
  });
  return await quota.save();
};

export const getStorageQuotaByUserId = async (userId: string) => {
  return await StorageQuota.findOne({ userId });
};

export const updateStorageQuota = async (userId: string, updatedData: object) => {
  return await StorageQuota.findOneAndUpdate({ userId }, updatedData, { new: true });
};

export const deleteStorageQuota = async (userId: string) => {
  return await StorageQuota.findOneAndDelete({ userId });
};
