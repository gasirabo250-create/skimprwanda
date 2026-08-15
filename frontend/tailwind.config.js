/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0B',
          light: '#141416',
          soft: '#1E1E21',
        },
        // Legacy aliases so existing classes (bg-charcoal, text-silver) keep working
        charcoal: {
          DEFAULT: '#0A0A0B',
          light: '#141416',
        },
        silver: {
          DEFAULT: '#8A8D93',
          light: '#C7C9CD',
        },
        accent: {
          DEFAULT: '#FF5A1F',
          light: '#FF8248',
          dark: '#D6470F',
          50: '#FFF1EA',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.06)',
        cardDark: '0 2px 24px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(255,90,31,0.4), 0 0 24px rgba(255,90,31,0.25)',
      },
      backgroundImage: {
        'grid-light': 'linear-gradient(rgba(10,10,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,11,0.04) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
    },
  },
  plugins: [],
};
