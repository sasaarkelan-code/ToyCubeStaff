import { Controller, Get, Param, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { StatsService } from './stats.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('stats')
export class StatsController {
  constructor(private stats: StatsService) {}

  // Собственная статистика — любой авторизованный
  @Get('me/summary')
  mySummary(@CurrentUser('id') userId: string) {
    return this.stats.summary(userId);
  }

  @Get('me/chart')
  myChart(@CurrentUser('id') userId: string, @Query('days') days?: string) {
    return this.stats.chart(userId, days ? parseInt(days, 10) : 30);
  }

  @Get('me/calendar')
  myCalendar(
    @CurrentUser('id') userId: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.stats.calendar(
      userId,
      year ? parseInt(year, 10) : undefined,
      month ? parseInt(month, 10) : undefined,
    );
  }

  // Статистика других сотрудников — SENIOR_MODERATOR+
  @Roles(Role.SENIOR_MODERATOR)
  @Get('user/:id/summary')
  userSummary(@Param('id') id: string) {
    return this.stats.summary(id);
  }

  @Roles(Role.SENIOR_MODERATOR)
  @Get('user/:id/chart')
  userChart(@Param('id') id: string, @Query('days') days?: string) {
    return this.stats.chart(id, days ? parseInt(days, 10) : 30);
  }

  // Топы — доступны всем авторизованным
  @Get('tops')
  tops(@Query('metric') metric = 'checks', @Query('limit') limit?: string) {
    return this.stats.tops(metric, limit ? parseInt(limit, 10) : 10);
  }
}
