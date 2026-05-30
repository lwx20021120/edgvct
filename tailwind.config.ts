import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E10600',
          hover: '#FF1A14',
          dark: '#B30500',
        },
        bg: {
          primary: '#0A0A0A',
          secondary: '#141414',
          tertiary: '#1E1E1E',
          card: '#1A1A1A',
          elevated: '#252525',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A0A0A0',
          tertiary: '#666666',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#F0D078',
          dark: '#B8922E',
        },
        border: {
          DEFAULT: '#2A2A2A',
          light: '#3A3A3A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        number: ['Inter', 'DIN', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.4)',
        elevated: '0 4px 16px rgba(0, 0, 0, 0.5)',
        'glow-gold': '0 0 20px rgba(212, 168, 83, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
