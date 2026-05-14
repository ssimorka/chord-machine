/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#111113',
        surface: '#1c1c1f',
        surface2: '#242428',
        border: '#2e2e33',
        purple: { DEFAULT: '#9B5CFF', soft: '#b47eff', dim: '#9B5CFF33' },
        foreground: '#f0eeff',
        muted: '#888899',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      gridTemplateColumns: { '16': 'repeat(16, minmax(0, 1fr))' },
      borderRadius: { card: '12px' },
      container: {
        center: true,
        padding: '1.25rem',
        screens: { '2xl': '1400px' }
      }
    }
  },
  plugins: []
}
