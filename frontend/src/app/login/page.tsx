'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setBusy(true);
    try {
      await login(loginValue, password);
      router.push('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка входа');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="glass w-full max-w-sm animate-slide-up p-8">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange to-orange-deep font-display text-xl font-extrabold text-white shadow-glow">
            T
          </div>
          <span className="font-display text-2xl font-bold">
            Toy<span className="text-orange">Cube</span>
          </span>
        </Link>
        <p className="mb-6 text-center text-sm text-white/40">
          Вход в панель управления персоналом
        </p>

        <div className="space-y-4">
          <div>
            <label className="label">Логин</label>
            <input
              className="input"
              placeholder="@efkalid"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <label className="label">Пароль</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button onClick={handleSubmit} disabled={busy} className="btn-orange w-full">
            {busy ? 'Вход...' : 'Войти'}
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-white/30">
          Нет аккаунта? Обратитесь к администрации сервера.
        </p>
      </div>
    </main>
  );
}
