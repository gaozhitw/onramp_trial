/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
      "./resources/**/*.blade.php",
      "./resources/**/*.jsx",
      "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
      require("@tailwindcss/forms"),
      require("flowbite/plugin"),
  ],
}

