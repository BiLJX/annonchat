/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        xs: "16px",
        sm: "24px",
        md: "32px",
        lg: "40px",
        xl: "48px"
      },
      colors: {
        c_blue: {
          900: "#1E90FF",
          500: "#89CFF0"
        },
        c_yellow: {
          900: "#FFDD57"
        },
        c_red: {
          900: "#E57373"
        },
        c_gray: {
          900: "#182131",
          800: "#1D2739",
          700: "#233046",
          600: "#384B6B",
          500: "#8193B2",
          200: "#EFEFF8",
          100: "#F8F8FD"
        }
      }
    },
  },
  plugins: [],
}

