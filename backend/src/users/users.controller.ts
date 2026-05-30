import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ChangeRoleDto } from './dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  // Список аккаунтов — ADMIN+
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.users.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  // Создание/удаление аккаунтов — OWNER
  @Roles(Role.OWNER)
  @Post()
  create(@Body() dto: CreateUserDto, @CurrentUser('id') actorId: string) {
    return this.users.create(dto, actorId);
  }

  @Roles(Role.OWNER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    return this.users.remove(id, actorId);
  }

  // Изменение роли — ADMIN+ (но не OWNER-целей, проверка в сервисе)
  @Roles(Role.ADMIN)
  @Patch(':id/role')
  changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.users.changeRole(id, dto, actorId);
  }

  // Редактирование профиля — ADMIN+
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.users.update(id, dto, actorId);
  }
}
