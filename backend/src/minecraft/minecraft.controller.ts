import { Controller, Get, Inject } from '@nestjs/common';
import { MINECRAFT_PROVIDER, MinecraftProvider } from './minecraft.provider';
import { Public } from '../common/decorators/public.decorator';

@Controller('minecraft')
export class MinecraftController {
  constructor(
    @Inject(MINECRAFT_PROVIDER) private provider: MinecraftProvider,
  ) {}

  // Статус сервера — публичный (для главной страницы)
  @Public()
  @Get('status')
  status() {
    return this.provider.getServerStatus();
  }

  @Get('players')
  players() {
    return this.provider.getOnlinePlayers();
  }

  @Get('punishments')
  punishments() {
    return this.provider.getRecentPunishments();
  }
}
