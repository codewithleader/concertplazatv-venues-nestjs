import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesController } from './venues.controller';
import { HttpModule } from '@nestjs/axios';
import { S3Service } from 'src/media/services/aws/s3.service';
import { AwsConfig } from 'src/config/aws/aws.config';

@Module({
  imports: [HttpModule],
  controllers: [VenuesController],
  providers: [AwsConfig, S3Service, VenuesService],
})
export class VenuesModule {}
