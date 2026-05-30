'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import { IconSearch } from '@/components/icons';
import { ROLE_LABELS, STATUS_LABELS, type StaffMember, type Role, type StaffStatus } from '@/lib/types';

const STATUS_DOT: Record<StaffStatus, string> = {
  ONLINE: 'bg-emerald-400',
  OFFLINE: 'bg-white/30',
  VACATION: 'bg-amber-400',
};

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [sortBy, setSortBy] = useState<'joinedAt' | 'nickname' | 'lastActiveAt'>('joinedAt');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    params.set('sortBy', sortBy);
    try {
      const data = await api<StaffMember[]>(`/staff?${params.toString()}`);
      setStaff(data);
    } catch {
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, sortBy]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <PageHeader title="Персонал" subtitle="Состав администрации сервера" />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <IconSearch
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            className="input pl-9"
            placeholder="Поиск по нику или логину..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input max-w-[180px]"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | '')}
        >
          <option value="">Все ранги</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          className="input max-w-[180px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="joinedAt">По дате вступления</option>
          <option value="nickname">По нику</option>
          <option value="lastActiveAt">По активности</option>
        </select>
      </div>

      <div className="glass overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-[11px] uppercase tracking-wide text-white/35">
              <th className="px-5 py-3">Никнейм</th>
              <th className="px-5 py-3">Ранг</th>
              <th className="px-5 py-3">Дата вступления</th>
              <th className="px-5 py-3">Активность</th>
              <th className="px-5 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30">Загрузка...</td></tr>
            )}
            {!loading && staff.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-white/30">Ничего не найдено</td></tr>
            )}
            {!loading && staff.map((m) => (
              <tr key={m.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/15 font-display text-xs font-bold text-orange">
                      {m.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{m.nickname}</p>
                      <p className="text-xs text-white/35">{m.login}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="chip bg-orange/15 text-orange">{ROLE_LABELS[m.role]}</span>
                </td>
                <td className="px-5 py-3.5 text-white/60">
                  {new Date(m.joinedAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-orange-bright">{m.activity}</span>
                  <span className="text-xs text-white/30"> /нед</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-2 text-white/70">
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[m.status]}`} />
                    {STATUS_LABELS[m.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
