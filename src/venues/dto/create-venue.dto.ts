import {
  IsInt,
  IsString,
  IsUUID,
  ValidateNested,
  IsArray,
  IsOptional,
  Validate,
} from 'class-validator';
import { S3Object } from 'src/venues/interfaces/venue.interface';

class S3ObjectClass {
  @IsString()
  bucketName: string;

  @IsString()
  displayName: string;

  @IsString()
  key: string;

  @IsString()
  type: string;

  @IsString()
  url: string;
}

export class CreateVenueDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsUUID(4, { message: 'City ID must be a valid UUID v4' })
  cityId: string;

  @IsInt({ message: 'Capacity must be an integer' })
  capacity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Validate((value: any) => {
    if (!Array.isArray(value)) return false;
    for (const item of value) {
      if (!(item instanceof S3ObjectClass)) {
        return false;
      }
    }
    return true;
  })
  images: S3Object[];
}
