/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  purge: {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}'
    ],
    options: {
      safelist: {
        standard: [/^bg-/, /^text-/],
      },
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

