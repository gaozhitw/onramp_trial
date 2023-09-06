/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./resources/**/*.blade.php",
      "./resources/**/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [
      require("@tailwindcss/forms"),
  ],
}

