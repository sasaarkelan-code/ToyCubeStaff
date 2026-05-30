import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  // Сводка по сотруднику за период (день / неделя / месяц)
  async summary(userId: string) {
    const today = startOfDay();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 29);

    const stats = await this.prisma.dailyStat.findMany({
      where: { userId, date: { gte: monthAgo } },
      orderBy: { date: 'asc' },
    });

    const sum = (arr: typeof stats, field: keyof (typeof stats)[number]) =>
      arr.reduce((acc, s) => acc + (s[field] as number), 0);

    const dayStats = stats.filter((s) => s.date.getTime() === today.getTime());
    const weekStats = stats.filter((s) => s.date >= weekAgo);
    const monthStats = stats;

    const pack = (arr: typeof stats) => ({
      checks: sum(arr, 'checks'),
      mutes: sum(arr, 'mutes'),
      bans: sum(arr, 'bans'),
      warnings: sum(arr, 'warnings'),
      punishments: sum(arr, 'punishments'),
      playtimeMin: sum(arr, 'playtimeMin'),
    });

    return {
      day: pack(dayStats),
      week: pack(weekStats),
      month: pack(monthStats),
      total: pack(monthStats),
    };
  }

  // Данные для линейного графика за последние N дней
  async chart(userId: string, days = 30) {
    const from = startOfDay();
    from.setDate(from.getDate() - (days - 1));

    const stats = await this.prisma.dailyStat.findMany({
      where: { userId, date: { gte: from } },
      orderBy: { date: 'asc' },
    });

    return stats.map((s) => ({
      date: s.date.toISOString().slice(0, 10),
      checks: s.checks,
      mutes: s.mutes,
      bans: s.bans,
      warnings: s.warnings,
      playtimeMin: s.playtimeMin,
    }));
  }

  // Календарь активности за месяц: { day: number, value: checks }
  async calendar(userId: string, year?: number, month?: number) {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth(); // 0-based

    const from = new Date(y, m, 1);
    const to = new Date(y, m + 1, 1);

    const stats = await this.prisma.dailyStat.findMany({
      where: { userId, date: { gte: from, lt: to } },
      orderBy: { date: 'asc' },
    });

    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const map = new Map<number, number>();
    stats.forEach((s) => map.set(s.date.getDate(), s.checks));

    const cells: Array<{ day: number; value: number }> = [];
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, value: map.get(d) ?? 0 });
    }
    return { year: y, month: m, cells };
  }

  // Топы по разным метрикам
  async tops(metric: string, limit = 10) {
    const field =
      {
        checks: 'checks',
        mutes: 'mutes',
        punishments: 'punishments',
        playtime: 'playtimeMin',
      }[metric] ?? 'checks';

    const grouped = await this.prisma.dailyStat.groupBy({
      by: ['userId'],
      _sum: { [field]: true } as any,
      orderBy: { _sum: { [field]: 'desc' } } as any,
      take: limit,
    });

    const userIds = grouped.map((g) => g.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, nickname: true, login: true, role: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return grouped.map((g, i) => ({
      rank: i + 1,
      user: userMap.get(g.userId),
      value: (g._sum as any)[field] ?? 0,
    }));
  }
}
