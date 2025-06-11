import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const category = await this.prismaService.category.findMany();

    return category;
  }
  async getById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async update(dto: UpdateCategoryDto, id: string) {
    await this.getById(id);
    return this.prismaService.category.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prismaService.category.delete({
      where: {
        id,
      },
    });
  }
}
