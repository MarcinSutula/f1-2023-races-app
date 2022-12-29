/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBg: "#100636",
        primaryBgLight: "#271E4A",
        btnFadedRed: "#ff000038",
        textFadedWhite: "#ffffff91",
        spinnerMain: "#1e90ff",
        spinnerOuter: "#00008b",
      },
    },
  },
  plugins: [],
};
