import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AwsConfig } from 'src/config/aws/aws.config';
import { S3Object } from 'src/venues/interfaces/venue.interface';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;
  private readonly logger = new Logger('S3Service');

  constructor(private readonly awsConfig: AwsConfig) {
    this.s3 = new S3Client({
      region: this.awsConfig.s3Config.region!,
      credentials: {
        accessKeyId: this.awsConfig.s3Config.accessKeyId!,
        secretAccessKey: this.awsConfig.s3Config.secretAccessKey!,
      },
    });

    this.bucketName = this.awsConfig.s3Config.bucketName!;
  }

  async uploadFile(
    file: Express.Multer.File,
    fileKey: string,
    fileName: string,
    fileType: string,
  ): Promise<S3Object> {
    try {
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await this.s3.send(new PutObjectCommand(uploadParams));

      const url = `https://${this.bucketName}.s3.${this.awsConfig.s3Config.region}.amazonaws.com/${fileKey}`;

      return {
        bucketName: this.bucketName,
        displayName: fileName,
        key: fileKey,
        type: fileType,
        url: url,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('S3Service');
    }
  }
}
