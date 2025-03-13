import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  private readonly GRAPHQL_URL: string;
  private readonly AUTHORIZATION_TOKEN: string;

  constructor(private readonly configService: ConfigService) {
    this.GRAPHQL_URL = this.configService.get<string>('graphqlUrl')!;
    this.AUTHORIZATION_TOKEN =
      this.configService.get<string>('authorizationToken')!;
  }

  create(createVenueDto: CreateVenueDto) {
    return 'This action adds a new venue';
  }

  findAll() {
    return `This action returns all venues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venue`;
  }

  update(id: number, updateVenueDto: UpdateVenueDto) {
    return `This action updates a #${id} venue`;
  }

  remove(id: number) {
    return `This action removes a #${id} venue`;
  }
}
