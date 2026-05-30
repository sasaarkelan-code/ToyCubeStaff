'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';

export default function FormsPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader title="Формы" subtitle="Заявки на отпуск и обращения" />
      <div className="glass p-7">
        <h3 className="mb-5 flex items-center gap-2 font-semibold">📋 Отправить заявку на отпуск</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Дата начала отпуска</label>
            <input type="date" className="input" />
          </div>
          <div>
            <label className="label">Дата окончания отпуска</label>
            <input type="date" className="input" />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Причина</label>
          <input className="input" placeholder="Причина" />
        </div>
        <div className="mt-4">
          <label className="label">Комментарий</label>
          <textarea className="input min-h-[90px]" placeholder="Комментарий" />
        </div>
        <button onClick={() => setSent(true)} className="btn-orange mt-5">
          {sent ? 'Отправлено ✓' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}
