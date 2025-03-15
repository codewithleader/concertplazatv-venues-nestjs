export class FileFilterError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'FileFilterError';
  }
}

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file)
    return callback(
      new FileFilterError('File is empty. Make sure that the file is an image'),
      false,
    );

  const fileExtension = file.mimetype.split('/')[1];

  const validExtensions = ['jpg', 'jpeg', 'png'];

  if (validExtensions.includes(fileExtension)) return callback(null, true);

  callback(
    new FileFilterError(
      `Invalid file type. Only ${validExtensions.join(', ')} are allowed.`,
    ),
    false,
  );
};
