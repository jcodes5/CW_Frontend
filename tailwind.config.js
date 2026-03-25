/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        teal: {
          50:  '#f0fafb',
          100: '#d9f2f5',
          200: '#b0e4ec',
          300: '#7BC8D8', // Primary accent
          400: '#4db3c8',
          500: '#1A7A8A', // Primary brand
          600: '#166b79',
          700: '#115762',
          800: '#0d4450',
          900: '#09313b',
        },
        cream: {
          50:  '#fefefe',
          100: '#fdfdfc',
          200: '#faf9f7',
          300: '#f5f3ef',
          400: '#ede9e2',
          500: '#e3ddd4',
        },
        earth: {
          100: '#f4ede3',
          200: '#e8d9c4',
          300: '#d4b896',
          400: '#b8926a',
          500: '#8B6914', // Warm accent for eco elements
          600: '#6b5010',
        },
        forest: {
          400: '#5a8a4a',
          500: '#3d6b2d',
          600: '#2d5020',
        },
        charcoal: {
          800: '#1a1a1a',
          900: '#0d0d0d',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      },
      boxShadow: {
        'brand': '0 4px 24px rgba(26, 122, 138, 0.18)',
        'brand-lg': '0 8px 48px rgba(26, 122, 138, 0.25)',
        'card': '0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
