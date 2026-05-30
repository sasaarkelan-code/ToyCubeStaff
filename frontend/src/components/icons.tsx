import { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const IconHome = (p: P) => (
  <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9v11h14V9" /></svg>
);
export const IconWallet = (p: P) => (
  <svg {...base(p)}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h3" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base(p)}><path d="m4 12 5 5L20 6" /></svg>
);
export const IconStaff = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6M22 20a6 6 0 0 0-5-5.9" /></svg>
);
export const IconForms = (p: P) => (
  <svg {...base(p)}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
);
export const IconChart = (p: P) => (
  <svg {...base(p)}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
);
export const IconTrophy = (p: P) => (
  <svg {...base(p)}><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z" /><path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3M9 18h6M10 21h4M12 14v4" /></svg>
);
export const IconBook = (p: P) => (
  <svg {...base(p)}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 0 2 2h13" /></svg>
);
export const IconNote = (p: P) => (
  <svg {...base(p)}><path d="M5 3h10l4 4v14H5V3Z" /><path d="M15 3v4h4M9 13h6M9 17h6" /></svg>
);
export const IconShop = (p: P) => (
  <svg {...base(p)}><path d="M3 9h18l-1 11H4L3 9Z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></svg>
);
export const IconLogs = (p: P) => (
  <svg {...base(p)}><path d="M4 4h16v16H4z" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>
);
export const IconSettings = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>
);
export const IconLogout = (p: P) => (
  <svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
);
export const IconTelegram = (p: P) => (
  <svg {...base(p)}><path d="m22 3-9.5 9.5M22 3l-7 18-4-8-8-4 19-6Z" /></svg>
);
export const IconStar = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><path d="m12 2 3 6.5L22 9l-5 4.5L18.5 21 12 17l-6.5 4L7 13.5 2 9l7-.5L12 2Z" /></svg>
);
export const IconCopy = (p: P) => (
  <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
);
export const IconSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" /></svg>
);
