import { Module } from '@nestjs/common';
import { MinecraftController } from './minecraft.controller';
import { MINECRAFT_PROVIDER } from './minecraft.provider';
import { MockMinecraftProvider } from './mock.provider';

@Module({
  controllers: [MinecraftController],
  providers: [
    // Для реальной интеграции замените useClass на RestPluginProvider / RconProvider
    { provide: MINECRAFT_PROVIDER, useClass: MockMinecraftProvider },
  ],
})
export class MinecraftModule {}
