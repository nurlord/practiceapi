import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Auth()
  @Get()
  async getAllStores() {
    return this.storeService.getAll();
  }

  @Auth()
  @Get('by-id/:id')
  async getStoreById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.storeService.getStoreById(storeId, userId);
  }

  @Auth()
  @Post()
  async create(@Body() dto: CreateStoreDto, @CurrentUser('id') userId: string) {
    return this.storeService.create(dto, userId);
  }

  @Auth()
  @Put(':id')
  async update(
    @Body() dto: UpdateStoreDto,
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
  ) {
    return this.storeService.update(dto, userId, storeId);
  }

  @Auth()
  @Delete(':id')
  async delete(
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
  ) {
    return this.storeService.delete(userId, storeId);
  }
}
