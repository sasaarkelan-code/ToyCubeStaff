import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('logs')
export class LogsController {
  constructor(private logs: LogsService) {}

  // Логи доступны только ADMIN и OWNER
  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query('action') action?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.logs.findAll({
      action,
      take: take ? parseInt(take, 10) : 100,
      skip: skip ? parseInt(skip, 10) : 0,
    });
  }
}
