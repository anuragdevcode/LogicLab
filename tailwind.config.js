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
          DEFAULT: '#0b0f19',
          secondary: '#0f172a',
          tertiary: '#1e293b',
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
        body: ['Outfit', 'sans-serif'],
        mono: ['"Space Mono"', '"Fira Code"', 'monospace'],
      },
      spacing: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'topbar': '56px',
        'controls': '52px',
        'metrics': '52px',
      },
    },
  },
  plugins: [],
};
