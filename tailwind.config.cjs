/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: { logs: false, themes: ['night'] },
};
