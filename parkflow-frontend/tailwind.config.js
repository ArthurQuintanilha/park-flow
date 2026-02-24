/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'surface-dark': '#0D0D0D',
        'surface-light': '#FFFFFF',
        ink: '#111111',
        'ink-muted': '#6B7280',
        error: '#DC2626',
        'parkflow': {
          dark: '#1A4C7F',    
          light: '#00AACC',    
          cyan: '#00AACC',
          green: {
            DEFAULT: '#28A745',
            light: '#7ED321', 
          },
          white: '#FFFFFF',
        },
        'park': '#1A4C7F',
        'flow': '#00AACC',
      },
      backgroundImage: {
        'parkflow-gradient': 'linear-gradient(135deg, #1A4C7F 0%, #00AACC 100%)',
        'parkflow-green': 'linear-gradient(180deg, #28A745 0%, #7ED321 100%)',
      },
      fontFamily: {
      },
    },
  },
  plugins: [],
};
