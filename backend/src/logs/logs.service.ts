import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RecordLogInput {
  actorId?: string;
  action: string;
  target?: string;
  meta?: any;
  ip?: string;
}

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async record(input: RecordLogInput) {
    return this.prisma.actionLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        target: input.target,
        meta: input.meta ?? undefined,
        ip: input.ip,
      },
    });
  }

  async findAll(params: { action?: string; take?: number; skip?: number }) {
    const { action, take = 100, skip = 0 } = params;
    const [items, total] = await Promise.all([
      this.prisma.actionLog.findMany({
        where: action ? { action } : undefined,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: { actor: { select: { login: true, nickname: true, role: true } } },
      }),
      this.prisma.actionLog.count({ where: action ? { action } : undefined }),
    ]);
    return { items, total };
  }
}
