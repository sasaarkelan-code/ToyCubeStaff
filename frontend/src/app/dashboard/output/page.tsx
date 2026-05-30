'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import type { ChartPoint, StatsSummary } from '@/lib/types';

export default function OutputPage() {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [summary, setSummary] = useState<StatsSummary | null>(null);

  useEffect(() => {
    api<ChartPoint[]>('/stats/me/chart?days=30').then(setData).catch(() => {});
    api<StatsSummary>('/stats/me/summary').then(setSummary).catch(() => {});
  }, []);

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    Проверки: d.checks,
    Муты: d.mutes,
    Наказания: d.warnings + d.bans + d.mutes,
  }));

  const cards = [
    { label: 'Проверки за день', value: summary?.day.checks ?? 0 },
    { label: 'Муты за неделю', value: summary?.week.mutes ?? 0 },
    { label: 'Баны за месяц', value: summary?.month.bans ?? 0 },
    { label: 'Время в игре (мин)', value: summary?.month.playtimeMin ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <PageHeader title="Выработка" subtitle="Аналитика вашей активности за 30 дней" />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="glass p-5">
            <p className="text-xs text-white/40">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-orange-bright">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass p-6">
        <h3 className="mb-5 font-semibold">Динамика за 30 дней</h3>
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gChecks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7a18" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ff7a18" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gMutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} interval={4} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: '#120c08',
                border: '1px solid rgba(255,122,24,0.3)',
                borderRadius: 12,
                color: '#fff',
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="Проверки" stroke="#ff7a18" strokeWidth={2} fill="url(#gChecks)" />
            <Area type="monotone" dataKey="Муты" stroke="#f59e0b" strokeWidth={2} fill="url(#gMutes)" />
            <Area type="monotone" dataKey="Наказания" stroke="#e85d04" strokeWidth={2} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
