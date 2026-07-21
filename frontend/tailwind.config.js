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
        background: "#0F172A",
        cardBg: "#1E293B",
        primary: "#3B82F6",
        secondary: "#06B6D4",
        accent: "#10B981",
        muted: "#64748B",
        borderDark: "#334155",
        textLight: "#F8FAFC",
      },
      borderRadius: {
        'enterprise': '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
