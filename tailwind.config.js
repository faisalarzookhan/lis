/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#2A52BE',
        'accent-dark': '#1E3A8A',
        'accent-orange': '#F97316',
        'gray-custom': '#666666',
        'gray-light': '#E0E0E0',
        'gray-bg': '#F5F7FA',
        // Advanced glassmorphism colors
        'glass-light': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
        // Holographic effect colors
        'holo-primary': '#00D4FF',
        'holo-secondary': '#FF0080',
        'holo-tertiary': '#00FF88',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        // Advanced animations
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
        'morph': 'morph 8s ease-in-out infinite',
        'hologram': 'hologram 3s ease-in-out infinite',
        'magnetic': 'magnetic 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        // Advanced keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(120deg)' },
          '66%': { transform: 'translateY(-5px) rotate(240deg)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 20px rgba(42, 82, 190, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(42, 82, 190, 0.6)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        hologram: {
          '0%, 100%': {
            textShadow: '0 0 5px #00D4FF, 0 0 10px #00D4FF, 0 0 15px #00D4FF',
            filter: 'hue-rotate(0deg)'
          },
          '50%': {
            textShadow: '0 0 5px #FF0080, 0 0 10px #FF0080, 0 0 15px #FF0080',
            filter: 'hue-rotate(180deg)'
          },
        },
        magnetic: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'hologram': '0 0 20px rgba(0, 212, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
