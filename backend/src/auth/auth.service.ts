import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private logs: LogsService,
  ) {}

  async login(dto: LoginDto, ip?: string) {
    const user = await this.prisma.user.findUnique({ where: { login: dto.login } });
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Неверный логин или пароль');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    await this.logs.record({ actorId: user.id, action: 'LOGIN', ip });

    const token = await this.jwt.signAsync({
      sub: user.id,
      login: user.login,
      role: user.role,
    });

    return {
      accessToken: token,
      user: this.sanitize(user),
    };
  }

  async logout(userId: string) {
    await this.logs.record({ actorId: userId, action: 'LOGOUT' });
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.sanitize(user);
  }

  private sanitize(user: any) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
