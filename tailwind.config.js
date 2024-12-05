/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "purple-input": "#DAD3F2",
        "purple-placeholder": "#360983",
        "purple-label": "#462185",
        "red-titles": "#DB314A",
        "purple-login": "#4E08C5",
        "purple-register": "#F5EBFF",
        "purple-navbar": "#9679FF",
        
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
