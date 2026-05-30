import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { CreateUserDto, UpdateUserDto, ChangeRoleDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logs: LogsService,
  ) {}

  private sanitize(user: any) {
    if (!user) return user;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { joinedAt: 'asc' },
    });
    return users.map((u) => this.sanitize(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return this.sanitize(user);
  }

  async create(dto: CreateUserDto, actorId: string) {
    const exists = await this.prisma.user.findUnique({ where: { login: dto.login } });
    if (exists) throw new ConflictException('Логин уже занят');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        nickname: dto.nickname,
        passwordHash,
        role: dto.role ?? Role.MODERATOR,
        position: dto.position ?? 'Мл. Сотрудник',
      },
    });

    await this.logs.record({
      actorId,
      action: 'ACCOUNT_CREATE',
      target: user.login,
      meta: { role: user.role },
    });

    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    await this.findOne(id);
    const user = await this.prisma.user.update({ where: { id }, data: dto });

    await this.logs.record({
      actorId,
      action: 'PROFILE_UPDATE',
      target: user.login,
      meta: dto as any,
    });

    return this.sanitize(user);
  }

  async changeRole(id: string, dto: ChangeRoleDto, actorId: string) {
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Пользователь не найден');

    // Нельзя менять роль самому себе и нельзя трогать другого OWNER
    if (id === actorId) throw new ForbiddenException('Нельзя менять собственную роль');
    if (target.role === Role.OWNER) throw new ForbiddenException('Нельзя менять роль владельца');

    const oldRole = target.role;
    const user = await this.prisma.user.update({ where: { id }, data: { role: dto.role } });

    const action = this.roleLevel(dto.role) > this.roleLevel(oldRole) ? 'ROLE_GRANT' : 'ROLE_REVOKE';
    await this.logs.record({
      actorId,
      action,
      target: user.login,
      meta: { from: oldRole, to: dto.role },
    });

    return this.sanitize(user);
  }

  async remove(id: string, actorId: string) {
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Пользователь не найден');
    if (target.role === Role.OWNER) throw new ForbiddenException('Нельзя удалить владельца');
    if (id === actorId) throw new ForbiddenException('Нельзя удалить самого себя');

    await this.prisma.user.delete({ where: { id } });
    await this.logs.record({
      actorId,
      action: 'ACCOUNT_DELETE',
      target: target.login,
    });

    return { success: true };
  }

  private roleLevel(role: Role): number {
    return { MODERATOR: 1, SENIOR_MODERATOR: 2, ADMIN: 3, OWNER: 4 }[role];
  }
}
