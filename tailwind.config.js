/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F1E8',
        cream: '#FDFAF5',
        sand: '#EDE6D6',
        cocoa: '#2D261B',
        'dusty-rose': '#E9C8C2',
        'dusty-rose-accent': '#BA7C74',
        sage: '#BED0BF',
        'sage-accent': '#617E63',
        periwinkle: '#C5CEDF',
        'periwinkle-accent': '#5872A0',
        gold: '#D8C08A',
        'gold-accent': '#9A7A32',
        mauve: '#CBBED6',
        'mauve-accent': '#7A60A0',
      },
    },
  },
  plugins: [],
};
