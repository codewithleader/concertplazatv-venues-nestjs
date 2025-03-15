import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfig {
  constructor(private configService: ConfigService) {}

  get s3Config() {
    return {
      accessKeyId: this.configService.get<string>('awsAccessKeyId'),
      secretAccessKey: this.configService.get<string>('awsSecretAccessKey'),
      bucketName: this.configService.get<string>('awsS3BucketName'),
      region: this.configService.get<string>('awsRegion'),
    };
  }
}
