'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import { ROLE_LABELS, type TopEntry } from '@/lib/types';

const METRICS = [
  { key: 'checks', label: 'Топ проверок', unit: '' },
  { key: 'mutes', label: 'Топ мутов', unit: '' },
  { key: 'punishments', label: 'Топ наказаний', unit: '' },
  { key: 'playtime', label: 'Топ онлайна', unit: ' мин' },
] as const;

export default function TopsPage() {
  const [metric, setMetric] = useState<(typeof METRICS)[number]['key']>('checks');
  const [entries, setEntries] = useState<TopEntry[]>([]);

  useEffect(() => {
    api<TopEntry[]>(`/stats/tops?metric=${metric}&limit=20`)
      .then(setEntries)
      .catch(() => setEntries([]));
  }, [metric]);

  const unit = METRICS.find((m) => m.key === metric)?.unit ?? '';

  const medal = (rank: number) =>
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <PageHeader title="Топы" subtitle="Рейтинги сотрудников по метрикам" />

      <div className="mb-5 flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              metric === m.key
                ? 'bg-gradient-to-r from-orange to-orange-deep text-white shadow-glow'
                : 'border border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="glass divide-y divide-white/5">
        {entries.length === 0 && (
          <p className="py-10 text-center text-white/30">Нет данных</p>
        )}
        {entries.map((e) => (
          <div key={e.rank} className="flex items-center gap-4 px-5 py-3.5">
            <span className="w-8 text-center font-display font-bold text-orange">
              {medal(e.rank)}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/15 font-display text-sm font-bold text-orange">
              {e.user?.nickname.slice(0, 2).toUpperCase() ?? '?'}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{e.user?.nickname ?? '—'}</p>
              <p className="text-xs text-white/40">
                {e.user ? ROLE_LABELS[e.user.role] : ''}
              </p>
            </div>
            <span className="font-display text-lg font-bold text-orange-bright">
              {e.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
