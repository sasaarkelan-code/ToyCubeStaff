'use client';

interface StatRingProps {
  title: string;
  subtitle?: string;
  value: number;
  percent?: number | null; // 0..100, null => "??%"
}

// Кольцевой индикатор как на скриншоте личного кабинета (Проверки / Муты / Наказания)
export function StatRing({ title, subtitle, value, percent }: StatRingProps) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const pct = percent == null ? 0 : Math.min(100, Math.max(0, percent));
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="glass glass-hover flex flex-col items-center p-6">
      <p className="text-sm font-semibold">{title}</p>
      {subtitle && <p className="mb-3 text-xs text-white/40">{subtitle}</p>}
      <div className="relative mt-2 h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9a3c" />
              <stop offset="100%" stopColor="#e85d04" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold">{value}</span>
          <span className="text-xs text-white/40">
            {percent == null ? '??%' : `${Math.round(pct)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}
