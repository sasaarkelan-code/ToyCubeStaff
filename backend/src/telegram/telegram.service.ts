import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Заготовка под будущую интеграцию Telegram OAuth / Bot.
// Сейчас привязка не выполняется реально — только архитектура.
@Injectable()
export class TelegramService {
  constructor(private prisma: PrismaService) {}

  // В будущем: проверка подписи hash от Telegram Login Widget.
  // https://core.telegram.org/widgets/login#checking-authorization
  async verifyAuth(_payload: Record<string, any>): Promise<boolean> {
    // TODO: реализовать проверку HMAC-SHA256 с использованием bot token
    return true;
  }

  // Заглушка: помечает пользователя как "привязавшего" Telegram.
  async linkStub(userId: string, telegram?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        telegramLinked: true,
        telegram: telegram ?? undefined,
      },
      select: { id: true, telegram: true, telegramLinked: true },
    });
  }
}
