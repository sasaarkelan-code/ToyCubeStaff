import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StatsModule } from './stats/stats.module';
import { StaffModule } from './staff/staff.module';
import { ManualsModule } from './manuals/manuals.module';
import { LogsModule } from './logs/logs.module';
import { MinecraftModule } from './minecraft/minecraft.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StatsModule,
    StaffModule,
    ManualsModule,
    LogsModule,
    MinecraftModule,
    TelegramModule,
  ],
})
export class AppModule {}
