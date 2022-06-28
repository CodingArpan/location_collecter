module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}","./Components/**/*.{js,ts,jsx,tsx}"],

  theme: {
    screens: {
      'mob': { 'min': '300px', 'max': '600px' },
      'tab': { 'min': '601px', 'max': '1100px' },
      'desk': { 'min': '1100px', 'max': '1400px' },
      'xldesk': '1400px',

    },
    extend: {},
  },

  plugins: [],

}