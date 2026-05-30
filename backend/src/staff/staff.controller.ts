import { Controller, Get, Query } from '@nestjs/common';
import { Role, StaffStatus } from '@prisma/client';
import { StaffService } from './staff.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('staff')
export class StaffController {
  constructor(private staff: StaffService) {}

  // Просмотр состава — SENIOR_MODERATOR и выше
  @Roles(Role.SENIOR_MODERATOR)
  @Get()
  list(
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('status') status?: StaffStatus,
    @Query('sortBy') sortBy?: 'joinedAt' | 'nickname' | 'lastActiveAt',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.staff.list({ search, role, status, sortBy, order });
  }
}
