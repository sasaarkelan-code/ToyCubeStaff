import { Injectable } from '@nestjs/common';
import {
  MinecraftProvider,
  ServerStatus,
  PlayerPunishment,
} from './minecraft.provider';

// Тестовые данные. Заменяется реальным провайдером при интеграции.
@Injectable()
export class MockMinecraftProvider implements MinecraftProvider {
  async getServerStatus(): Promise<ServerStatus> {
    return {
      online: 75,
      maxOnline: 76,
      platform: 'Paper',
      version: '1.20.4',
    };
  }

  async getOnlinePlayers(): Promise<string[]> {
    return ['h0up', 'Heldyy', 'ThatOneBear', 'Asya_Masya', '69_mne_yzhe'];
  }

  async getRecentPunishments(): Promise<PlayerPunishment[]> {
    const now = Date.now();
    return [
      { player: 'Griefer123', type: 'BAN', reason: 'Грифинг', moderator: 'Heldyy', at: new Date(now - 5 * 60000).toISOString() },
      { player: 'SpamBot', type: 'MUTE', reason: 'Спам в чате', moderator: 'Asya_Masya', at: new Date(now - 18 * 60000).toISOString() },
      { player: 'RudeGuy', type: 'WARN', reason: 'Оскорбления', moderator: 'ThatOneBear', at: new Date(now - 42 * 60000).toISOString() },
    ];
  }
}
