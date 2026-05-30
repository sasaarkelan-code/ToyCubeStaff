'use client';
import { PageHeader } from '@/components/page-header';
import { IconCheck } from '@/components/icons';

export default function ChecksPage() {
  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <PageHeader title="Проверки" subtitle="Проведение и история проверок игроков" />
      <div className="glass flex flex-col items-center justify-center p-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange/15 text-orange">
          <IconCheck width={32} height={32} />
        </div>
        <p className="font-semibold">Модуль проверок</p>
        <p className="mt-2 max-w-md text-sm text-white/40">
          Запуск проверки и фиксация результатов будут доступны после интеграции
          с Minecraft-сервером. Сейчас данные формируются из Mock Data.
        </p>
        <button className="btn-orange mt-6">Начать проверку</button>
      </div>
    </div>
  );
}
