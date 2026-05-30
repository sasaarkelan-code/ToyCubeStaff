import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Иерархия: чем выше число, тем больше полномочий.
// Пользователь проходит, если его уровень >= минимального требуемого.
export const ROLE_LEVEL: Record<Role, number> = {
  MODERATOR: 1,
  SENIOR_MODERATOR: 2,
  ADMIN: 3,
  OWNER: 4,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Не авторизован');

    const userLevel = ROLE_LEVEL[user.role as Role] ?? 0;
    const minRequired = Math.min(...requiredRoles.map((r) => ROLE_LEVEL[r]));

    if (userLevel < minRequired) {
      throw new ForbiddenException('Недостаточно прав');
    }
    return true;
  }
}
