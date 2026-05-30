import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ManualsService } from './manuals.service';
import { CreateManualDto, UpdateManualDto } from './dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('manuals')
export class ManualsController {
  constructor(private manuals: ManualsService) {}

  // Чтение — все авторизованные
  @Get()
  findAll(@Query('category') category?: string) {
    return this.manuals.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manuals.findOne(id);
  }

  // Редактирование — только ADMIN и OWNER
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateManualDto, @CurrentUser('id') authorId: string) {
    return this.manuals.create(dto, authorId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateManualDto) {
    return this.manuals.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manuals.remove(id);
  }
}
