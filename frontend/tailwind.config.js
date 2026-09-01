/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#0B0F17',
          900: '#111827',
          850: '#151E2E',
          800: '#1F2937',
          700: '#374151',
          600: '#4B5563',
          400: '#9CA3AF',
          300: '#D1D5DB',
        },
        status: {
          green: '#10B981',
          yellow: '#F59E0B',
          orange: '#F97316',
          red: '#EF4444',
        },
        cyan: {
          accent: '#06B6D4',
          glow: 'rgba(6, 182, 212, 0.25)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'belt-move': 'beltMove 1.2s linear infinite',
      },
      keyframes: {
        beltMove: {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-30' },
        }
      }
    },
  },
  plugins: [],
}
