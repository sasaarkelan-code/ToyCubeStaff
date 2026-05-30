'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import type { ActionLog } from '@/lib/types';

const ACTION_LABELS: Record<string, string> = {
  LOGIN: 'Вход',
  LOGOUT: 'Выход',
  ROLE_GRANT: 'Выдача роли',
  ROLE_REVOKE: 'Снятие роли',
  PROFILE_UPDATE: 'Изменение профиля',
  ACCOUNT_CREATE: 'Создание аккаунта',
  ACCOUNT_DELETE: 'Удаление аккаунта',
  SEED: 'Инициализация',
};

const ACTION_COLOR: Record<string, string> = {
  LOGIN: 'bg-emerald-500/15 text-emerald-400',
  LOGOUT: 'bg-white/10 text-white/60',
  ROLE_GRANT: 'bg-orange/15 text-orange',
  ROLE_REVOKE: 'bg-red-500/15 text-red-400',
  ACCOUNT_CREATE: 'bg-blue-500/15 text-blue-400',
  ACCOUNT_DELETE: 'bg-red-500/15 text-red-400',
};

export default function LogsPage() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = filter ? `?action=${filter}` : '';
    api<{ items: ActionLog[]; total: number }>(`/logs${q}`)
      .then((r) => setLogs(r.items))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <PageHeader title="Логи" subtitle="Журнал всех действий в системе" />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${!filter ? 'bg-orange/20 text-orange' : 'bg-white/[0.03] text-white/50'}`}
        >
          Все
        </button>
        {Object.keys(ACTION_LABELS).filter((a) => a !== 'SEED').map((a) => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${filter === a ? 'bg-orange/20 text-orange' : 'bg-white/[0.03] text-white/50 hover:text-white'}`}
          >
            {ACTION_LABELS[a]}
          </button>
        ))}
      </div>

      <div className="glass divide-y divide-white/5">
        {loading && <p className="py-10 text-center text-white/30">Загрузка...</p>}
        {!loading && logs.length === 0 && (
          <p className="py-10 text-center text-white/30">Логи отсутствуют</p>
        )}
        {!loading && logs.map((log) => (
          <div key={log.id} className="flex items-center gap-4 px-5 py-3">
            <span className={`chip ${ACTION_COLOR[log.action] ?? 'bg-white/10 text-white/60'}`}>
              {ACTION_LABELS[log.action] ?? log.action}
            </span>
            <div className="flex-1 text-sm">
              <span className="font-semibold">{log.actor?.nickname ?? 'Система'}</span>
              {log.target && <span className="text-white/40"> → {log.target}</span>}
            </div>
            <span className="text-xs text-white/30">
              {new Date(log.createdAt).toLocaleString('ru-RU')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
