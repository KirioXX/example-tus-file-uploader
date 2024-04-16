import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  storageDriver: process.env.STORAGE_DRIVER || 'local',
}));
