'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';

export default function NotesPage() {
  const [notes, setNotes] = useState<string[]>([]);
  const [text, setText] = useState('');
  const add = () => {
    if (!text.trim()) return;
    setNotes([text, ...notes]);
    setText('');
  };
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <PageHeader title="Заметки" subtitle="Личные заметки (хранятся локально в сессии)" />
      <div className="glass mb-4 p-5">
        <textarea
          className="input min-h-[80px]"
          placeholder="Новая заметка..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={add} className="btn-orange mt-3">Добавить</button>
      </div>
      <div className="space-y-3">
        {notes.length === 0 && <p className="text-center text-sm text-white/30">Пока нет заметок</p>}
        {notes.map((n, i) => (
          <div key={i} className="glass p-4 text-sm text-white/80">{n}</div>
        ))}
      </div>
    </div>
  );
}
