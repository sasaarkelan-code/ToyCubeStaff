'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_LABELS, ROLE_LEVEL, type Role } from '@/lib/types';
import {
  IconHome,
  IconWallet,
  IconCheck,
  IconStaff,
  IconForms,
  IconChart,
  IconTrophy,
  IconBook,
  IconNote,
  IconShop,
  IconLogs,
  IconSettings,
  IconLogout,
} from './icons';

interface NavItem {
  href: string;
  label: string;
  icon: (p: any) => ReactNode;
  minRole?: Role;
  group: string;
}

// Разделы по ТЗ. «Аккаунт» переименован в «Главная», убраны «Прошки»/«Вопросы».
const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Главная', icon: IconHome, group: 'Быстрый доступ' },
  { href: '/dashboard/wallet', label: 'Кошелек', icon: IconWallet, group: 'Быстрый доступ' },

  { href: '/dashboard/checks', label: 'Проверки', icon: IconCheck, group: 'Управление' },
  { href: '/dashboard/staff', label: 'Персонал', icon: IconStaff, minRole: 'SENIOR_MODERATOR', group: 'Управление' },
  { href: '/dashboard/forms', label: 'Формы', icon: IconForms, group: 'Управление' },

  { href: '/dashboard/output', label: 'Выработка', icon: IconChart, group: 'Активности' },
  { href: '/dashboard/tops', label: 'Топы', icon: IconTrophy, group: 'Активности' },

  { href: '/dashboard/manuals', label: 'Мануалы', icon: IconBook, group: 'Ресурсы' },
  { href: '/dashboard/notes', label: 'Заметки', icon: IconNote, group: 'Ресурсы' },
  { href: '/dashboard/shop', label: 'Магазин', icon: IconShop, group: 'Ресурсы' },

  { href: '/dashboard/logs', label: 'Логи', icon: IconLogs, minRole: 'ADMIN', group: 'Администрирование' },
  { href: '/dashboard/settings', label: 'Настройки', icon: IconSettings, minRole: 'OWNER', group: 'Администрирование' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const canSee = (item: NavItem) =>
    !item.minRole || (user && ROLE_LEVEL[user.role] >= ROLE_LEVEL[item.minRole]);

  const visible = NAV.filter(canSee);
  const groups = Array.from(new Set(visible.map((i) => i.group)));

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/5 bg-bg-soft/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-deep font-display text-lg font-extrabold text-white shadow-glow">
          T
        </div>
        <span className="font-display text-lg font-bold tracking-tight">
          Toy<span className="text-orange">Cube</span>
        </span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white/25">
              {group}
            </p>
            <div className="space-y-0.5">
              {visible
                .filter((i) => i.group === group)
                .map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-orange/15 text-orange'
                          : 'text-white/55 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon width={18} height={18} />
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        {user && (
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange/15 font-display text-sm font-bold text-orange">
              {user.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.nickname}</p>
              <p className="truncate text-xs text-white/40">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <IconLogout width={18} height={18} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
