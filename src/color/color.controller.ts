import { ColorService } from './color.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
import { Auth } from '../auth/decorators/auth.decorator';
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Auth()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.colorService.getById(id);
  }

  @Auth()
  @Post()
  async create(@Body() dto: CreateColorDto) {
    return this.colorService.create(dto);
  }

  @Auth()
  @Put(':id')
  async update(@Body() dto: UpdateColorDto, @Param('id') id: string) {
    return this.colorService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
