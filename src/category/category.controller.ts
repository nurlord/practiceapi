import { CategoryService } from './category.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from '@/prisma/generated';
import { Auth } from '../auth/decorators/auth.decorator';
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get('by-storeid/:storeId')
  async getByStoreId(@Param('storeId') id: string): Promise<Category[]> {
    return this.categoryService.getByStoreId(id);
  }

  @Get('by-id/:id')
  async getById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getById(id);
  }

  @Auth()
  @Post(':storeId')
  async create(
    @Body() dto: CreateCategoryDto,
    @Param('storeId') storeId: string,
  ): Promise<Category> {
    return this.categoryService.create(dto, storeId);
  }

  @Auth()
  @Put(':id')
  async update(
    @Body() dto: UpdateCategoryDto,
    @Param('id') id: string,
  ): Promise<Category> {
    return this.categoryService.update(dto, id);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Category> {
    return this.categoryService.delete(id);
  }
}
