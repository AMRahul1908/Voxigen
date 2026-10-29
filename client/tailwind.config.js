/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          navy: '#101329',      // Midnight Navy
          indigo: '#211B45',    // Deep Indigo
          purple: '#4C2A85',    // Royal Purple
          gold: '#D6B46A',      // Antique Gold
          'gold-light': '#F3D898',
          'gold-dark': '#A37E36',
          ivory: '#FFF8E9',     // Warm Ivory
          lavender: '#E9E1F5',  // Lavender
          border: 'rgba(214, 180, 106, 0.22)',
          'border-subtle': 'rgba(233, 225, 245, 0.12)',
          card: 'rgba(33, 27, 69, 0.65)',
          'card-hover': 'rgba(40, 32, 85, 0.85)',
          surface: '#171433'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at 50% 20%, #291F56 0%, #171433 50%, #101329 100%)',
        'gold-shimmer': 'linear-gradient(135deg, #FFF8E9 0%, #D6B46A 50%, #B89243 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(33, 27, 69, 0.75) 0%, rgba(16, 19, 41, 0.85) 100%)',
        'glow-radial': 'radial-gradient(circle, rgba(214, 180, 106, 0.15) 0%, rgba(76, 42, 133, 0.05) 50%, transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 25px -5px rgba(214, 180, 106, 0.25)',
        'purple-glow': '0 0 35px -5px rgba(76, 42, 133, 0.35)',
        'cosmic-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
