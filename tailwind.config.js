/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#090d16',
          secondary: '#0e1424',
          tertiary: '#1a2234',
        },
        accent: {
          DEFAULT: '#3b82f6',
          green: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        },
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      spacing: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'topbar': '48px',
        'controls': '48px',
        'metrics': '36px',
      },
    },
  },
  plugins: [],
};
