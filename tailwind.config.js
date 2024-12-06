/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "lavender-light": "#DAD3F2",
        "purple-darker": "#360983",
        "indigo-loud": "#462185",
        "rusty-red": "#DB314A",
        "purple-dark": "#4E08C5",
        "lavender-pale": "#F5EBFF",
        "lavender": "#9679FF",
        
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
