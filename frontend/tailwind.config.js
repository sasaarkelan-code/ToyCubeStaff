/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0705',
          soft: '#120c08',
          panel: 'rgba(28, 20, 14, 0.6)',
        },
        orange: {
          DEFAULT: '#ff7a18',
          bright: '#ff9a3c',
          deep: '#e85d04',
          glow: 'rgba(255, 122, 24, 0.25)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 122, 24, 0.25)',
        panel: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'orange-radial':
          'radial-gradient(circle at 70% 40%, rgba(255,122,24,0.18), transparent 60%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
