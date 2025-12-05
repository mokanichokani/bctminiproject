import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        neo: {
          bg: '#FDFD96', // Pastel Yellow
          primary: '#FF6B6B', // Pastel Red
          secondary: '#4ECDC4', // Pastel Teal
          accent: '#FFE66D', // Pastel Yellow (Darker)
          dark: '#2C3E50',
          light: '#F7F9F9',
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-hover': '6px 6px 0px 0px #000000',
        'neo-active': '2px 2px 0px 0px #000000',
      },
      borderRadius: {
        'neo': '0px', // Sharp edges for brutalism
      }
    },
  },
  plugins: [],
}
export default config

