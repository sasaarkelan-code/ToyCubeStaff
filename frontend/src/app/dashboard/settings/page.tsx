'use client';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/page-header';
import { IconSettings } from '@/components/icons';

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <PageHeader title="Настройки" subtitle="Конфигурация сайта и интеграций (только OWNER)" />
      <div className="space-y-4">
        <div className="glass p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <IconSettings width={18} height={18} className="text-orange" /> Интеграции
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <span>Minecraft (Velocity / Paper / Purpur)</span>
              <span className="chip bg-amber-500/15 text-amber-400">Mock Data</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <span>Telegram Bot / OAuth</span>
              <span className="chip bg-amber-500/15 text-amber-400">Заглушка</span>
            </div>
          </div>
        </div>
        <div className="glass p-6">
          <h3 className="mb-3 font-semibold">Текущий администратор</h3>
          <p className="text-sm text-white/60">
            {user?.nickname} ({user?.login}) — полный доступ ко всем разделам.
          </p>
        </div>
      </div>
    </div>
  );
}
