import { PrismaClient, Role, WorkMode, StaffStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const OWNER_LOGIN = process.env.OWNER_LOGIN || '@efkalid';
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'ChangeThisOwnerPassword123';

// Вспомогательное: случайное целое
const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Набор mock-сотрудников
const mockStaff: Array<{
  login: string;
  nickname: string;
  role: Role;
  position: string;
  status: StaffStatus;
}> = [
  { login: '@h0up', nickname: 'h0up', role: Role.ADMIN, position: 'Администратор', status: StaffStatus.ONLINE },
  { login: '@heldyy', nickname: 'Heldyy', role: Role.SENIOR_MODERATOR, position: 'Гл. Модератор', status: StaffStatus.ONLINE },
  { login: '@mrpasta', nickname: 'MrPastaKing', role: Role.MODERATOR, position: 'Модератор', status: StaffStatus.OFFLINE },
  { login: '@hili', nickname: 'HiliGHoO9', role: Role.MODERATOR, position: 'Модератор', status: StaffStatus.VACATION },
  { login: '@thatonebear', nickname: 'ThatOneBear', role: Role.MODERATOR, position: 'Мл. Модератор', status: StaffStatus.ONLINE },
  { login: '@bolgarly', nickname: 'Bolgarly', role: Role.SENIOR_MODERATOR, position: 'Зам. Куратора', status: StaffStatus.OFFLINE },
  { login: '@asya', nickname: 'Asya_Masya', role: Role.MODERATOR, position: 'Модератор', status: StaffStatus.ONLINE },
  { login: '@69mne', nickname: '69_mne_yzhe', role: Role.MODERATOR, position: 'Модератор', status: StaffStatus.ONLINE },
];

async function ensureUser(opts: {
  login: string;
  nickname: string;
  role: Role;
  password: string;
  position?: string;
  status?: StaffStatus;
  telegram?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { login: opts.login } });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(opts.password, 10);
  return prisma.user.create({
    data: {
      login: opts.login,
      nickname: opts.nickname,
      role: opts.role,
      passwordHash,
      position: opts.position ?? 'Мл. Сотрудник',
      status: opts.status ?? StaffStatus.OFFLINE,
      workMode: WorkMode.ANARCHY,
      telegram: opts.telegram ?? null,
      telegramLinked: !!opts.telegram,
      currency: rnd(50, 500),
      joinedAt: new Date(Date.now() - rnd(30, 400) * 24 * 3600 * 1000),
    },
  });
}

async function seedDailyStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const checks = rnd(0, 50);
    const mutes = rnd(0, 15);
    const bans = rnd(0, 5);
    const warnings = rnd(0, 8);

    await prisma.dailyStat.upsert({
      where: { userId_date: { userId, date } },
      update: {},
      create: {
        userId,
        date,
        checks,
        mutes,
        bans,
        warnings,
        punishments: mutes + bans + warnings,
        playtimeMin: rnd(0, 360),
      },
    });
  }
}

async function main() {
  console.log('🌱 Seeding ToyCube...');

  // 1. OWNER
  const owner = await ensureUser({
    login: OWNER_LOGIN,
    nickname: 'efkalid',
    role: Role.OWNER,
    password: OWNER_PASSWORD,
    position: 'Владелец проекта',
    status: StaffStatus.ONLINE,
    telegram: '@efkalid',
  });
  console.log(`✅ OWNER: ${owner.login}`);
  await seedDailyStats(owner.id);

  // 2. Mock-сотрудники (общий пароль для теста: "password")
  for (const s of mockStaff) {
    const user = await ensureUser({
      login: s.login,
      nickname: s.nickname,
      role: s.role,
      password: 'password',
      position: s.position,
      status: s.status,
      telegram: s.login,
    });
    await seedDailyStats(user.id);
    console.log(`   + ${user.login} (${user.role})`);
  }

  // 3. Мануалы
  const manuals = [
    { title: 'Регламент модерации', category: 'Модерация', content: '# Регламент модерации\n\nОсновные правила работы модератора...' },
    { title: 'Виды наказаний', category: 'Наказания', content: '# Наказания\n\n- Предупреждение\n- Мут\n- Бан\n' },
    { title: 'Как проводить проверки', category: 'Проверки', content: '# Проверки\n\nАлгоритм проведения проверки игрока...' },
    { title: 'Обработка жалоб', category: 'Жалобы', content: '# Жалобы\n\nКак принимать и обрабатывать жалобы...' },
    { title: 'Правила сервера', category: 'Правила', content: '# Правила\n\nПолный свод правил проекта...' },
  ];
  for (const m of manuals) {
    const exists = await prisma.manual.findFirst({ where: { title: m.title } });
    if (!exists) {
      await prisma.manual.create({ data: { ...m, authorId: owner.id } });
    }
  }
  console.log(`✅ Мануалы: ${manuals.length}`);

  // 4. Стартовый лог
  await prisma.actionLog.create({
    data: { actorId: owner.id, action: 'SEED', target: 'system', meta: { note: 'initial seed' } },
  });

  console.log('🎉 Seed завершён.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
