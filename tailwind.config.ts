import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds (senza prefisso bg-)
        'black': 'var(--bg-black)',
        'dark': 'var(--bg-dark)',
        'darker': 'var(--bg-darker)',
        'cell': 'var(--bg-cell)',
        
        // Borders (come border-*)
        'border': {
          dark: 'var(--border-dark)',
          medium: 'var(--border-medium)',
          light: 'var(--border-light)',
          focus: 'var(--border-focus)',
        },
        
        // Text (come text-*)
        'text': {
          white: 'var(--text-white)',
          light: 'var(--text-light)',
          medium: 'var(--text-medium)',
          gray: 'var(--text-gray)',
          lighter: 'var(--text-lighter)',
        },
        
        // Functional
        'vercel': 'var(--blue-vercel)',
        'purple': 'var(--purple)',
        'orange': 'var(--orange)',
        'wall': 'var(--wall)',
      },
    },
  },
  plugins: [],
};

export default config;