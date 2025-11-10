/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'arena': {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          danger: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
        },
        'dark': {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#2a2a2a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #6366f1' },
          '100%': { boxShadow: '0 0 20px #6366f1, 0 0 30px #6366f1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

