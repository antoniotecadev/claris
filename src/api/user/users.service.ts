import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async registerWithEmail(dto: UserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    const passwordHash = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash,
        gender: dto.gender,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        avatarUrl: dto.avatarUrl,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
      },
    });

    return {
      success: true,
      profile: user,
    };
  }

  async getMe(UserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: UserId },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      success: true,
      profile: user,
    };
  }

  async updateMe(
    dto: UserDto,
    UserId: string
  ) {

    const updatedUser = await this.prisma.user.update({
      where: { id: UserId },
      data: {
        ...(dto.displayName !== undefined
          ? { displayName: dto.displayName }
          : {}),
        lastSeen: new Date(),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
      },
    });

    return {
      success: true,
      profile: updatedUser,
    };
  }


  async deleteMyAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId},
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.$transaction([
      this.prisma.user.delete({
        where: { id: user.id },
      }),
    ]);

    return {
      success: true,
    };
  }
}
