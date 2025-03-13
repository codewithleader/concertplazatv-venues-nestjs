import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
//
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  private readonly logger = new Logger('VenuesService');
  private readonly GRAPHQL_URL: string;
  private readonly AUTHORIZATION_TOKEN: string;
  private readonly FILE_PATH: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.GRAPHQL_URL = this.configService.get<string>('graphqlUrl')!;
    this.AUTHORIZATION_TOKEN = `Bearer ${this.configService.get<string>('authorizationToken')}`;
    this.FILE_PATH = this.configService.get<string>('filePath')!;
  }

  private getAuthHeaders() {
    return {
      Authorization: this.AUTHORIZATION_TOKEN,
    };
  }

  async getCityId(cityName: string): Promise<string | undefined> {
    const query = `
      query GetCities($filter: CityFilter!) {
        cities(filter: $filter) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;
    const variables = {
      filter: {
        name: { eq: cityName },
      },
    };
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          this.GRAPHQL_URL,
          { query, variables },
          { headers: this.getAuthHeaders() },
        ),
      );
      const city = response.data.data.cities.edges[0]?.node;
      return city ? city.id : undefined;
    } catch (error) {
      console.error('Error getting city ID:', error);
      throw error;
    }
  }

  async create(createVenueDto: CreateVenueDto) {
    const mutation = `
      mutation($input: CreateOneVenueInput!) {
        createOneVenue(input: $input) {
        name
      }
      }
    `;
    const variables = {
      input: {
        venue: {
          ...createVenueDto,
          images: [],
        },
      },
    };
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          this.GRAPHQL_URL,
          { query: mutation, variables },
          { headers: this.getAuthHeaders() },
        ),
      );
      return response.data.data.createOneVenue;
    } catch (error) {
      this.logger.error('Error creating venue:', error);
      throw error;
    }
  }

  async processExcelAndCreateVenues(): Promise<any> {
    // Leer el archivo .xlsx desde el sistema de archivos local
    const fileBuffer = fs.readFileSync(this.FILE_PATH);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[2]];

    // Leemos el contenido de la hoja y obtenemos las filas
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      range: 2,
    });

    for (const row of rows) {
      if (row[6] && row[7] && row[row.length - 1]) {
        const venueName = row[6] as string;
        const cityName = row[7] as string;
        const capacity = row[row.length - 1] as number;

        // Buscamos el ID de la ciudad en GraphQL
        const cityId = await this.getCityId(cityName);
        console.log(`City ID: ${cityId}, Name: ${cityName}`);
        const venueFound = await this.getVenueId(venueName);
        if (venueFound != undefined) {
          this.logger.error(`Venue ${venueName} already exists.`);
          continue;
        }

        if (cityId) {
          const createVenueDto = {
            cityId,
            name: venueName,
            capacity,
          };
          await this.create(createVenueDto);
        } else {
          this.logger.error(`City ${cityName} not found.`);
        }
      }
    }
  }

  findAll() {
    return `This action returns all venues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venue`;
  }

  async getVenueId(venueName: string): Promise<string | undefined> {
    const query = `
      query GetVenues($filter: VenueFilter!) {
        venues(filter: $filter) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `;
    const variables = {
      filter: {
        name: { eq: venueName },
      },
    };
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          this.GRAPHQL_URL,
          { query, variables },
          { headers: this.getAuthHeaders() },
        ),
      );
      const venue = response.data.data.venues.edges[0]?.node;
      return venue ? venue.id : undefined;
    } catch (error) {
      console.error('Error getting city ID:', error);
      throw error;
    }
  }

  update(id: number, updateVenueDto: UpdateVenueDto) {
    return `This action updates a #${id} venue`;
  }

  remove(id: number) {
    return `This action removes a #${id} venue`;
  }
}
