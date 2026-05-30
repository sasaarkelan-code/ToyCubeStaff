'use client';
import { PageHeader } from '@/components/page-header';
import { IconShop } from '@/components/icons';

const ITEMS = [
  { name: 'VIP статус', price: '199 ₽', desc: 'Цветной ник, доступ к /kit vip' },
  { name: 'PREMIUM статус', price: '399 ₽', desc: 'Все привилегии VIP + /fly' },
  { name: 'DELUXE статус', price: '799 ₽', desc: 'Максимальный набор возможностей' },
  { name: 'Снятие бана', price: '299 ₽', desc: 'Разблокировка аккаунта' },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <PageHeader title="Магазин" subtitle="Привилегии и услуги сервера" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.name} className="glass glass-hover p-5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange/15 text-orange">
              <IconShop width={24} height={24} />
            </div>
            <p className="font-semibold">{it.name}</p>
            <p className="mt-1 text-xs text-white/40">{it.desc}</p>
            <p className="mt-4 font-display text-xl font-bold text-orange-bright">{it.price}</p>
            <button className="btn-ghost mt-3 w-full text-sm">Купить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
