/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "text-secondary": "var(--text-secondary)",
        "text-tan": "var(--text-tan)",
        "btn-bg": "var(--btn-bg)",
        "btn-text": "var(--btn-text)",
        "btn-hover": "var(--btn-hover)",
        "btn-tan": "var(--btn-tan)",
        "btn-tan-text": "var(--btn-tan-text)",
        "btn-tan-hover": "var(--btn-tan-hover)",
        "dark-panel": "var(--dark-panel)",
        "badge-circle": "var(--badge-circle)",
        "badge-circle-text": "var(--badge-circle-text)",
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",
        surface: "var(--surface)",
        "surface-card": "var(--surface-card)",
        "surface-card-hover": "var(--surface-card-hover)",
        "tag-bg": "var(--tag-bg)",
        "tag-text": "var(--tag-text)",
        "tag-border": "var(--tag-border)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.8", filter: "blur(32px)" },
        }
      }
    },
  },
  plugins: [],
};
