// Абстракция интеграции с Minecraft-сервером.
// Реализации: MockMinecraftProvider (сейчас), в будущем RestPluginProvider / RconProvider
// для платформ Velocity / BungeeCord / Spigot / Paper / Purpur.

export interface ServerStatus {
  online: number;
  maxOnline: number;
  platform: string;
  version: string;
}

export interface PlayerPunishment {
  player: string;
  type: 'MUTE' | 'BAN' | 'WARN';
  reason: string;
  moderator: string;
  at: string;
}

export interface MinecraftProvider {
  getServerStatus(): Promise<ServerStatus>;
  getOnlinePlayers(): Promise<string[]>;
  getRecentPunishments(): Promise<PlayerPunishment[]>;
}

export const MINECRAFT_PROVIDER = 'MINECRAFT_PROVIDER';
