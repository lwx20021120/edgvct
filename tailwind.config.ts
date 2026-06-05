import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 新设计主色
        accent: {
          DEFAULT: '#E11D48',
          hover: '#FB254E',
          dark: '#BE123C',
        },
        // 向后兼容：旧 primary/gold 类名映射到新 accent 色值
        primary: {
          DEFAULT: '#E11D48',
          hover: '#FB254E',
          dark: '#BE123C',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#F0D078',
          dark: '#B8922E',
        },
        bg: {
          primary: '#000000',
          secondary: '#09090B',
          tertiary: '#0C0C0D',
          card: '#0C0C0D',
          elevated: '#121214',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          tertiary: '#666666',
          inverse: '#000000',
        },
        border: {
          DEFAULT: '#312E81',
          light: '#4C4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        number: ['JetBrains Mono', 'Inter', 'DIN', 'monospace'],
      },
      boxShadow: {
        'accent-glow-sm': '0 0 12px rgba(225, 29, 72, 0.3)',
        'accent-glow': '0 0 20px rgba(225, 29, 72, 0.4)',
        'accent-glow-lg': '0 0 40px rgba(225, 29, 72, 0.15)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'glow-gold': '0 0 20px rgba(212, 168, 83, 0.3)',
        'neon-heading': '0 0 80px rgba(225, 29, 72, 0.15), 0 0 40px rgba(225, 29, 72, 0.3), 0 0 16px rgba(225, 29, 72, 0.6)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(225,29,72,0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(225,29,72,0.7), 0 0 40px rgba(225,29,72,0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
