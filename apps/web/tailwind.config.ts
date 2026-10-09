import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fame: {
          pink:     '#E5007E',
          purple:   '#4A0E7A',
          magenta:  '#FF168D',
          bg:       '#0A0A0A',
          surface:  '#141414',
          surface2: '#1F1F1F',
          line:     'rgba(255,255,255,0.09)',
          muted:    '#9E9EA8',
          dim:      '#5A5A63',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'fame-grad': 'linear-gradient(135deg,#FF168D 0%,#E5007E 50%,#4A0E7A 100%)',
      },
    },
  },
  plugins: [],
};

export default config;