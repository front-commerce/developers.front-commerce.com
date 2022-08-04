/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./{src,docs,changelog}/**/*.{js,ts,jsx,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#BB1F4E",
          50: "#F0A2B9",
          100: "#ED91AC",
          200: "#E76E92",
          300: "#E14B78",
          400: "#DB285E",
          500: "#BB1F4E",
          600: "#8B173A",
          700: "#5B0F26",
          800: "#2B0712",
          900: "#000000",
        },
        // TODO - find the docosaurus css variable used in body backgrounds
        darkGray: "#1b1b1d",
      },
    },
  },
  corePlugins: {
    preflight: false,
    container: false, // we use the container from the infirma styles
  },
};
