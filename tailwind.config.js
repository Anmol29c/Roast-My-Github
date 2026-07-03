/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0D1117',
        surface: '#161B22',
        border: '#30363D',
        ember: '#FF6B35',
        embersoft: '#FFA36C',
        diffgreen: '#3FB950',
        diffred: '#F85149',
        muted: '#8B949E',
        paper: '#E6EDF3',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
