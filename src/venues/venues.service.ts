import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import * as path from 'node:path';
//
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import {
  MappedVenue,
  VenueResponse,
} from 'src/venues/interfaces/venue.interface';

@Injectable()
export class VenuesService {
  private readonly logger = new Logger('VenuesService');
  private readonly GRAPHQL_URL: string;
  private readonly FILE_PATH: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.GRAPHQL_URL = this.configService.get<string>('graphqlUrl')!;
    this.FILE_PATH = this.configService.get<string>('filePath')!;
  }

  async getCityId(cityName: string): Promise<string | undefined> {
    const query = `
      query GetCity($filter: CityFilter!) {
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
        this.httpService.post(this.GRAPHQL_URL, { query, variables }),
      );
      const city = response.data.data.cities.edges[0]?.node;
      return city ? city.id : undefined;
    } catch (error) {
      this.logger.error('Error getting city ID:', error);
      throw error;
    }
  }

  async create(createVenueDto: CreateVenueDto) {
    const mutation = `
      mutation CreateVenue($input: CreateOneVenueInput!) {
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
        this.httpService.post(this.GRAPHQL_URL, { query: mutation, variables }),
      );
      return response.data.data.createOneVenue;
    } catch (error) {
      this.logger.error('Error creating venue:', error);
      throw error;
    }
  }

  async processExcelAndCreateVenues(): Promise<any> {
    // Leer el archivo .xlsx
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

        const cityId = await this.getCityId(cityName);
        this.logger.log(`City ID: ${cityId}, Name: ${cityName}`);
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

  async findAll() {
    const query = `
      query Venues {
        venues {
          edges {
            node {
              id
              name
              capacity
              images {
                bucketName
                displayName
                key
                type
                url
              }
              cityId
            }
          }
        }
      }
    `;
    try {
      const response = await lastValueFrom(
        this.httpService.post(this.GRAPHQL_URL, { query }),
      );

      const venueResponse: VenueResponse | null = response.data.data;

      if (venueResponse) {
        const venues: MappedVenue[] = venueResponse.venues.edges.map(
          (edge) => ({
            id: edge.node.id,
            images: edge.node.images,
            name: edge.node.name,
          }),
        );

        this.writeVenuesToFile(venues);

        return venues;
      } else {
        this.writeVenuesToFile([]);
        return [];
      }
    } catch (error) {
      this.logger.error('Error findAll:', error);
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} venue`;
  }

  async getVenueId(venueName: string): Promise<string | undefined> {
    const query = `
      query Venues ($filter: VenueFilter!) {
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
        this.httpService.post(this.GRAPHQL_URL, { query, variables }),
      );
      const venue = response.data.data.venues.edges[0]?.node;
      return venue ? venue.id : undefined;
    } catch (error) {
      this.logger.error('Error getting city ID:', error);
      throw error;
    }
  }

  update(id: number, updateVenueDto: UpdateVenueDto) {
    return `This action updates a #${id} venue`;
  }

  remove(id: number) {
    return `This action removes a #${id} venue`;
  }

  private writeVenuesToFile(venues: MappedVenue[]) {
    const content = `import { MappedVenue } from 'src/venues/interfaces/venue.interface';\n\nexport const venues: MappedVenue[] = ${JSON.stringify(
      venues,
      null,
      2,
    )
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, "'")};\n`;

    const filePath = path.join(process.cwd(), 'seed/venues/venues.seed.ts');

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);

    this.logger.log(`venues.seed.ts file created: ${filePath}`);
  }
}
