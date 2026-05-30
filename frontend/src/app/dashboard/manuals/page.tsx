'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/page-header';
import { ROLE_LEVEL, type Manual } from '@/lib/types';

const CATEGORIES = ['Все', 'Модерация', 'Наказания', 'Проверки', 'Жалобы', 'Правила'];

export default function ManualsPage() {
  const { user } = useAuth();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [category, setCategory] = useState('Все');
  const [active, setActive] = useState<Manual | null>(null);

  const canEdit = user && ROLE_LEVEL[user.role] >= ROLE_LEVEL['ADMIN'];

  const load = () => {
    const q = category === 'Все' ? '' : `?category=${encodeURIComponent(category)}`;
    api<Manual[]>(`/manuals${q}`)
      .then((data) => {
        setManuals(data);
        if (data.length && !active) setActive(data[0]);
      })
      .catch(() => setManuals([]));
  };

  useEffect(load, [category]);

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <PageHeader title="Мануалы" subtitle="База знаний для администрации">
        {canEdit && (
          <span className="chip bg-orange/15 text-orange">Режим редактора доступен</span>
        )}
      </PageHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              category === c
                ? 'bg-orange/20 text-orange'
                : 'border border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-[280px_1fr]">
        <div className="glass divide-y divide-white/5 self-start">
          {manuals.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-white/30">Нет мануалов</p>
          )}
          {manuals.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m)}
              className={`block w-full px-5 py-3.5 text-left text-sm transition-colors ${
                active?.id === m.id ? 'bg-orange/10 text-orange' : 'hover:bg-white/[0.03]'
              }`}
            >
              <p className="font-semibold">{m.title}</p>
              <p className="text-xs text-white/35">{m.category}</p>
            </button>
          ))}
        </div>

        <div className="glass p-7">
          {active ? (
            <article className="prose-toycube">
              <h2 className="mb-1 font-display text-2xl font-extrabold">{active.title}</h2>
              <p className="mb-5 text-xs text-white/35">
                {active.category}
                {active.author && ` · автор: ${active.author.nickname}`}
              </p>
              <div className="space-y-3 text-sm leading-relaxed text-white/75 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-orange">
                <ReactMarkdown>{active.content}</ReactMarkdown>
              </div>
            </article>
          ) : (
            <p className="py-10 text-center text-white/30">Выберите мануал слева</p>
          )}
        </div>
      </div>
    </div>
  );
}
