import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/media/helpers/multer.config';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  create() {
    return this.venuesService.processExcelAndCreateVenues();
  }

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    return this.venuesService.update(file, id, updateVenueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venuesService.remove(id);
  }
}
