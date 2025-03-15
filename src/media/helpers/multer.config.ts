import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import { fileFilter } from 'src/media/helpers/fileFilter.helper';

export const multerOptions: MulterOptions = {
  fileFilter: fileFilter,
  storage: multer.memoryStorage(), // Guarda en memoria para subir a S3
  limits: {
    fileSize: 5242880, // 5 * 1024 * 1024 // Limite de 5MB por archivo
  },
};
