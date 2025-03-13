import { IsInt, IsString, IsUUID } from 'class-validator';

export class CreateVenueDto {
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsUUID(4, { message: 'City ID must be a valid UUID v4' })
  cityId: string;

  @IsInt({ message: 'Capacity must be an integer' })
  capacity: number;
}
