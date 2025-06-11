import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/src/prisma/prisma.service';
import { User } from '@/prisma/generated';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(dto: CreateUserDto): Promise<boolean> {
    const { email, name: username, password } = dto;

    const isEmailExists = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isEmailExists) {
      throw new ConflictException('This email is already taken');
    }

    await this.prismaService.user.create({
      data: {
        name: username,
        email: email,
        password: await hash(password),
      },
    });

    return true;
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        stores: true,
        orders: true,
        reviews: true,
        favorites: {
          include: { category: true },
        },
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        stores: true,
        favorites: true,
      },
    });

    return user;
  }

  public async findByLogin(login: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            email: { equals: login },
          },
        ],
      },
    });
    return user;
  }

  public async update(userId: string, dto: UpdateUserDto) {
    const isUser = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!isUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });

    return updatedUser;
  }
}
