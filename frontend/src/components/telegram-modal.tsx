'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { IconTelegram } from './icons';

// Модалка первого входа: «Привяжите Telegram».
// Реальная привязка пока не выполняется — это заглушка с архитектурой под OAuth.
export function TelegramModal() {
  const { user, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && !user.telegramLinked) setOpen(true);
  }, [user]);

  if (!open) return null;

  const handleLink = async () => {
    setBusy(true);
    try {
      // На текущем этапе backend просто помечает linked=true.
      // В будущем здесь будет редирект на Telegram Login Widget / OAuth.
      await api('/telegram/link', { method: 'POST', body: {} });
      await refresh();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-md animate-slide-up p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/15 text-orange">
          <IconTelegram width={32} height={32} />
        </div>
        <h2 className="mb-3 text-xl font-bold">
          Привяжите Telegram для дальнейшего использования сайта
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-white/50">
          Для работы с системой необходимо привязать Telegram аккаунт.
        </p>
        <button onClick={handleLink} disabled={busy} className="btn-orange w-full">
          <IconTelegram width={18} height={18} />
          {busy ? 'Привязка...' : 'Привязать Telegram'}
        </button>
      </div>
    </div>
  );
}
