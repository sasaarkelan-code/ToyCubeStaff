'use client';

import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/page-header';
import { IconWallet } from '@/components/icons';

export default function WalletPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <PageHeader title="Кошелек" subtitle="Ваш баланс внутренней валюты" />

      <div className="glass relative overflow-hidden p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange/10 blur-3xl" />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/15 text-orange">
            <IconWallet width={28} height={28} />
          </div>
          <div>
            <p className="text-sm text-white/40">Текущий баланс</p>
            <p className="font-display text-4xl font-extrabold text-orange-bright">
              {user.currency} <span className="text-2xl">◈</span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs text-white/40">Заработано за месяц</p>
            <p className="mt-1 text-xl font-bold">+{Math.round(user.currency * 0.3)} ◈</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs text-white/40">Потрачено за месяц</p>
            <p className="mt-1 text-xl font-bold">-{Math.round(user.currency * 0.1)} ◈</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          История транзакций появится после интеграции с Minecraft-сервером.
        </p>
      </div>
    </div>
  );
}
