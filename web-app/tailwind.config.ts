import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#004e89',
        secondary: '#ff6b35',
        background: '#efefd0',
        accent: '#f7c59f',
        text: '#1a659e',
        success: '#4CAF50',
        warning: '#FFC107',
        danger: '#F44336'
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    },
  },
  plugins: [],
} satisfies Config;
