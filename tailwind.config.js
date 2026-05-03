/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: { 950:'#0A0A0F', 900:'#12121A', 800:'#1C1C28', 700:'#2A2A3D', 600:'#3D3D5C' },
        gold: { 50:'#FFFBF0', 100:'#FFF3CC', 200:'#FFE485', 300:'#FFD54F', 400:'#FFC107', 500:'#FF9800' },
        jade: { 50:'#F0FFF8', 100:'#CCFFE9', 200:'#85FFCC', 300:'#00E5A0', 400:'#00C880', 500:'#00A066' },
        cream: '#FAFAF5',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity:'0', transform:'translateY(24px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
        pulseGlow: { '0%,100%': { boxShadow:'0 0 20px rgba(0,229,160,0.3)' }, '50%': { boxShadow:'0 0 40px rgba(0,229,160,0.6)' } },
      },
    },
  },
  plugins: [],
}
