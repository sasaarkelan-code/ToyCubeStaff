import { Injectable } from '@nestjs/common';
import { Prisma, Role, StaffStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  // Список состава с поиском / фильтром / сортировкой
  async list(params: {
    search?: string;
    role?: Role;
    status?: StaffStatus;
    sortBy?: 'joinedAt' | 'nickname' | 'lastActiveAt';
    order?: 'asc' | 'desc';
  }) {
    const { search, role, status, sortBy = 'joinedAt', order = 'asc' } = params;

    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { nickname: { contains: search, mode: 'insensitive' } },
        { login: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        login: true,
        nickname: true,
        role: true,
        position: true,
        status: true,
        joinedAt: true,
        lastActiveAt: true,
      },
    });

    // Активность за последние 7 дней (сумма проверок) для колонки "Активность"
    const enriched = await Promise.all(
      users.map(async (u) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const agg = await this.prisma.dailyStat.aggregate({
          where: { userId: u.id, date: { gte: weekAgo } },
          _sum: { checks: true, punishments: true },
        });
        return {
          ...u,
          activity: (agg._sum.checks ?? 0) + (agg._sum.punishments ?? 0),
        };
      }),
    );

    return enriched;
  }
}
