export const theme = {
  color: {
    accent: '#E11D48',
    accentHover: '#FB254E',
    accentDark: '#BE123C',
    bgPrimary: '#000000',
    bgSecondary: '#09090B',
    bgTertiary: '#0C0C0D',
    bgCard: '#0C0C0D',
    bgElevated: '#121214',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#666666',
    border: '#312E81',
    borderLight: '#4C4899',
  },
  radius: {
    sm: '0px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadow: {
    card: '0 4px 16px rgba(0, 0, 0, 0.3)',
    accentGlow: '0 0 20px rgba(225, 29, 72, 0.4)',
    accentGlowLg: '0 0 40px rgba(225, 29, 72, 0.15)',
    neonHeading: '0 0 80px rgba(225, 29, 72, 0.15), 0 0 40px rgba(225, 29, 72, 0.3), 0 0 16px rgba(225, 29, 72, 0.6)',
  },
  transition: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease',
  },
} as const
