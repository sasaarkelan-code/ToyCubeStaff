export type Role = 'MODERATOR' | 'SENIOR_MODERATOR' | 'ADMIN' | 'OWNER';
export type WorkMode = 'ANARCHY' | 'LIGHT';
export type StaffStatus = 'ONLINE' | 'OFFLINE' | 'VACATION';

export interface User {
  id: string;
  login: string;
  nickname: string;
  role: Role;
  telegram: string | null;
  telegramLinked: boolean;
  position: string;
  workMode: WorkMode;
  status: StaffStatus;
  warnings: number;
  reprimands: number;
  onVacation: boolean;
  currency: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface StatBlock {
  checks: number;
  mutes: number;
  bans: number;
  warnings: number;
  punishments: number;
  playtimeMin: number;
}

export interface StatsSummary {
  day: StatBlock;
  week: StatBlock;
  month: StatBlock;
  total: StatBlock;
}

export interface ChartPoint {
  date: string;
  checks: number;
  mutes: number;
  bans: number;
  warnings: number;
  playtimeMin: number;
}

export interface CalendarCell {
  day: number;
  value: number;
}

export interface CalendarData {
  year: number;
  month: number;
  cells: CalendarCell[];
}

export interface TopEntry {
  rank: number;
  user: { id: string; nickname: string; login: string; role: Role } | undefined;
  value: number;
}

export interface StaffMember {
  id: string;
  login: string;
  nickname: string;
  role: Role;
  position: string;
  status: StaffStatus;
  joinedAt: string;
  lastActiveAt: string;
  activity: number;
}

export interface Manual {
  id: string;
  title: string;
  category: string;
  content: string;
  author?: { nickname: string; login: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActionLog {
  id: string;
  action: string;
  target: string | null;
  ip: string | null;
  createdAt: string;
  actor?: { login: string; nickname: string; role: Role } | null;
}

export const ROLE_LABELS: Record<Role, string> = {
  MODERATOR: 'Модератор',
  SENIOR_MODERATOR: 'Ст. Модератор',
  ADMIN: 'Администратор',
  OWNER: 'Владелец',
};

export const ROLE_LEVEL: Record<Role, number> = {
  MODERATOR: 1,
  SENIOR_MODERATOR: 2,
  ADMIN: 3,
  OWNER: 4,
};

export const STATUS_LABELS: Record<StaffStatus, string> = {
  ONLINE: 'В сети',
  OFFLINE: 'Не в сети',
  VACATION: 'В отпуске',
};
