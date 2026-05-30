'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { IconStar, IconCopy, IconShop, IconTrophy } from '@/components/icons';

interface ServerStatus {
  online: number;
  maxOnline: number;
  platform: string;
  version: string;
}

const SOCIAL = [
  { label: 'Discord', value: '4 142' },
  { label: 'ВКонтакте', value: '1 500' },
  { label: 'Telegram', value: '4 992' },
];

const TOPS = [
  { nick: 'h0up', sub: 'Лидер донатов', value: '21 188 ₽' },
  { nick: 'Heldyy', sub: 'Топ онлайна', value: '312 ч' },
  { nick: 'MrPastaKing', sub: 'Топ проверок', value: '789' },
];

const PURCHASES = [
  '14 минут назад',
  '16 минут назад',
  '23 минуты назад',
  'около 2 часов назад',
  'около 3 часов назад',
];

export default function LandingPage() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api<ServerStatus>('/minecraft/status', { auth: false })
      .then(setStatus)
      .catch(() => setStatus({ online: 75, maxOnline: 76, platform: 'Paper', version: '1.20.4' }));
  }, []);

  const copyIp = () => {
    navigator.clipboard?.writeText('mc.toycube.su');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen">
      {/* Шапка */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-deep font-display text-lg font-extrabold text-white shadow-glow">
            T
          </div>
          <span className="font-display text-xl font-bold">
            Toy<span className="text-orange">Cube</span>
          </span>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/60 md:flex">
          <span className="text-orange">Главная</span>
          <Link href="/dashboard/shop" className="hover:text-white">Магазин</Link>
          <span className="cursor-pointer hover:text-white">Форум</span>
          <span className="cursor-pointer hover:text-white">Банлист</span>
          <Link href="/dashboard/tops" className="hover:text-white">Топы</Link>
          <span className="cursor-pointer hover:text-white">Правила</span>
        </nav>
        <Link href="/login" className="btn-orange px-4 py-2 text-sm">Войти</Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-slide-up">
          <h1 className="font-display text-6xl font-extrabold tracking-tight text-gradient-orange md:text-7xl">
            ToyCube
          </h1>
          <p className="mt-5 max-w-md text-white/55">
            Лучший кубический сервер Minecraft! Для игры вам понадобится клиент
            Minecraft Java Edition от версии 1.16.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={copyIp} className="btn-orange">
              <span className="h-2 w-2 rounded-full bg-white" />
              {copied ? 'Скопировано!' : 'mc.toycube.su'}
              <IconCopy width={16} height={16} />
            </button>
            <Link href="/dashboard/shop" className="btn-ghost">
              <IconShop width={18} height={18} />
              Магазин
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute left-1/2 top-8 -translate-x-1/2 chip bg-gradient-to-r from-orange to-orange-deep text-white shadow-glow">
            <IconStar width={14} height={14} /> Лучший игрок: h0up
          </div>
          <div className="mt-16 flex h-72 w-44 items-end justify-center rounded-3xl bg-gradient-to-b from-orange/10 to-transparent">
            {/* Плейсхолдер скина игрока */}
            <div className="h-56 w-28 rounded-lg bg-gradient-to-b from-emerald-800 to-emerald-950 shadow-glow" />
          </div>
        </div>
      </section>

      {/* Статус-бары */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="glass flex items-center justify-between px-4 py-3">
            <span className="text-sm font-semibold">Онлайн</span>
            <span className="chip bg-orange/20 text-orange">
              {status ? `${status.online}/${status.maxOnline}` : '—'}
            </span>
          </div>
          {SOCIAL.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange to-orange-deep px-4 py-3 text-white shadow-glow"
            >
              <span className="text-sm font-semibold">{s.label}</span>
              <span className="text-sm font-bold">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Топы + последние покупки */}
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-2">
        <div className="glass p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <IconTrophy width={18} height={18} className="text-orange" /> Топы
          </div>
          <div className="space-y-3">
            {TOPS.map((t, i) => (
              <div key={t.nick} className="flex items-center gap-3">
                <span className="font-display text-sm font-bold text-orange">#{i + 1}</span>
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange/40 to-orange-deep/40" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.nick}</p>
                  <p className="text-xs text-white/40">{t.sub}</p>
                </div>
                <span className="font-display text-sm font-bold text-orange">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Последние покупки
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PURCHASES.map((p, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-white/50">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/30">
        ToyCube © 2026 · Minecraft Java Server Management
      </footer>
    </main>
  );
}
