'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { StatRing } from '@/components/stat-ring';
import { ROLE_LABELS, STATUS_LABELS } from '@/lib/types';
import type { StatsSummary, TopEntry, CalendarData } from '@/lib/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [tops, setTops] = useState<TopEntry[]>([]);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);

  useEffect(() => {
    api<StatsSummary>('/stats/me/summary').then(setSummary).catch(() => {});
    api<TopEntry[]>('/stats/tops?metric=checks&limit=10').then(setTops).catch(() => {});
    api<CalendarData>('/stats/me/calendar').then(setCalendar).catch(() => {});
  }, []);

  if (!user) return null;

  const monthName = calendar
    ? new Date(calendar.year, calendar.month).toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Цвет ячейки календаря по интенсивности
  const cellColor = (v: number) => {
    if (v === 0) return 'bg-white/[0.03] text-white/30';
    if (v < 10) return 'bg-orange/20 text-orange-bright';
    if (v < 25) return 'bg-orange/40 text-white';
    return 'bg-gradient-to-br from-orange to-orange-deep text-white';
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">
      <div className="chip bg-orange/10 text-orange/80">
        ⓘ Данные о вашей работе обновляются раз в 15 минут.
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Профиль */}
        <div className="glass p-6">
          <h2 className="font-display text-3xl font-extrabold">{user.nickname}</h2>
          {user.telegram && (
            <p className="mt-1 text-sm text-white/40">{user.telegram}</p>
          )}
          <div className="mt-5 space-y-2.5 text-sm">
            <Row label="Должность" value={user.position} />
            <Row label="Telegram" value={user.telegram ?? '—'} accent />
            <Row label="Режим" value={user.workMode === 'ANARCHY' ? 'Анархия' : 'Лайт'} />
            <Row label="Преды" value={String(user.warnings)} />
            <Row label="Выговоры" value={String(user.reprimands)} />
            <Row label="Отпуск" value={user.onVacation ? 'В отпуске' : 'не в отпуске'} />
            <Row label="Валюта" value={`${user.currency} ◈`} accent />
            <Row label="Статус" value={STATUS_LABELS[user.status]} />
            <Row label="Ранг" value={ROLE_LABELS[user.role]} accent />
          </div>
        </div>

        {/* Топ по проверкам */}
        <div className="glass p-6">
          <h3 className="mb-4 text-center font-semibold">Топ по проверкам</h3>
          <div className="space-y-1.5">
            <div className="flex justify-between px-2 text-[10px] uppercase tracking-wide text-white/30">
              <span># Никнейм</span>
              <span>Проверок</span>
            </div>
            {tops.length === 0 && (
              <p className="py-6 text-center text-sm text-white/30">Нет данных</p>
            )}
            {tops.map((t) => (
              <div
                key={t.rank}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 font-display text-xs text-orange">{t.rank}.</span>
                  {t.user?.nickname ?? '—'}
                </span>
                <span className="font-semibold">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Календарь выработки */}
        <div className="glass p-6">
          <h3 className="mb-4 text-center font-semibold">Ваша выработка за месяц</h3>
          {calendar && (
            <>
              <div className="grid grid-cols-7 gap-1.5">
                {calendar.cells.map((c) => (
                  <div
                    key={c.day}
                    className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-bold ${cellColor(
                      c.value,
                    )}`}
                  >
                    {c.value}
                    <span className="absolute right-1 top-0.5 text-[8px] opacity-50">
                      {c.day}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm capitalize text-white/50">
                {monthName}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Кольца статистики + сводка */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatRing title="Проверки" subtitle="за месяц" value={summary?.month.checks ?? 0} percent={100} />
          <StatRing title="Муты" subtitle="за месяц" value={summary?.month.mutes ?? 0} percent={null} />
          <StatRing title="Наказания" subtitle="за месяц" value={summary?.month.punishments ?? 0} percent={null} />
          <StatRing title="Баны" subtitle="за месяц" value={summary?.month.bans ?? 0} percent={null} />
        </div>

        <div className="glass p-6">
          <h3 className="mb-4 font-display text-2xl font-extrabold">
            Ваша статистика по работе
          </h3>
          <div className="space-y-3 text-sm">
            <p>
              Всего вы сделали{' '}
              <span className="font-bold text-orange">{summary?.total.checks ?? 0}</span>{' '}
              проверок
            </p>
            <p>
              А за месяц сделано{' '}
              <span className="font-bold text-orange">{summary?.month.checks ?? 0}</span>{' '}
              проверок
            </p>
            <p>
              За сегодня выполнено{' '}
              <span className="font-bold text-orange">{summary?.day.checks ?? 0}</span>{' '}
              проверок
            </p>
            <p className="text-white/40">
              Статистика по мутам, гарантам и наказаниям — скоро...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-white/40">{label}:</span>
      <span className={accent ? 'font-semibold text-orange' : 'font-medium'}>{value}</span>
    </div>
  );
}
