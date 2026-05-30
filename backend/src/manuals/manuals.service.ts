import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManualDto, UpdateManualDto } from './dto';

@Injectable()
export class ManualsService {
  constructor(private prisma: PrismaService) {}

  findAll(category?: string) {
    return this.prisma.manual.findMany({
      where: category ? { category } : undefined,
      orderBy: { updatedAt: 'desc' },
      include: { author: { select: { nickname: true, login: true } } },
    });
  }

  async findOne(id: string) {
    const manual = await this.prisma.manual.findUnique({
      where: { id },
      include: { author: { select: { nickname: true, login: true } } },
    });
    if (!manual) throw new NotFoundException('Мануал не найден');
    return manual;
  }

  create(dto: CreateManualDto, authorId: string) {
    return this.prisma.manual.create({ data: { ...dto, authorId } });
  }

  async update(id: string, dto: UpdateManualDto) {
    await this.findOne(id);
    return this.prisma.manual.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.manual.delete({ where: { id } });
    return { success: true };
  }
}
