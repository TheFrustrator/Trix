/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors:{
        'primary': "#264067",
        'secondary': "#F3F6FA",
        'border':"#7BBCE7",
        'primary1':"#CADEF6",
        "activeCol":"#276749"
      },
    },
  },
  plugins: [],
}