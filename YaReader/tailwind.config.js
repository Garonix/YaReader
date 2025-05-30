/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        reader: {
          paper: '#f8f4e9',
          ink: '#3a3a3a',
          dim: '#282c35',
          night: '#121212',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.reader.ink'),
            lineHeight: '1.6',
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
            p: {
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 