/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kmer: {
          white: '#FFFFFF',      // 60% dominant
          light: '#7CFFB2',      // 30% secondaire
          dark: '#0B3D2E',       // 10% accents sombres
          neon: '#00E676',       // Glow effect
          glass: 'rgba(255, 255, 255, 0.9)',
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'], // Police scientifique
      },
    },
  },
  plugins: [],
}