import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('telegram')
export class TelegramController {
  constructor(private telegram: TelegramService) {}

  // Заглушка привязки. На текущем этапе просто помечает linked=true.
  @Post('link')
  link(
    @CurrentUser('id') userId: string,
    @Body('telegram') telegram?: string,
  ) {
    return this.telegram.linkStub(userId, telegram);
  }
}
