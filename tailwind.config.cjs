/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        night: {
          ...require('daisyui/src/colors/themes')['[data-theme=night]'],
          '--rounded-box': '0.25rem',
          '--rounded-btn': '0.125rem',
          '--rounded-badge': '0.125rem',
          '--tab-radius': '0',
        },
      },
    ],
  },
};
