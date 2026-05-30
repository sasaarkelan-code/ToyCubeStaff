import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'ToyCube — Панель управления',
  description: 'Система управления персоналом Minecraft сервера ToyCube',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <div className="relative z-10">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
