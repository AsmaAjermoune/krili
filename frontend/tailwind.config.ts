import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#004e98", foreground: "#ffffff" },
        brand: { DEFAULT: "#ff6700", foreground: "#ffffff" },
        ink: "#0f172a",
        muted: { DEFAULT: "#64748b", foreground: "#ffffff" },
        "muted-light": "#94a3b8",
        surface: "#ffffff",
        "surface-alt": "#fdf4f8",
        rose: { DEFAULT: "#f43f5e", light: "#fb7185", pale: "#fce7f3" },
        pink: { DEFAULT: "#ec4899", light: "#f472b6", pale: "#fdf2f8" },
        blush: "#fff1f7",
        mauve: "#d946ef",
        lavender: "#a78bfa",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        card: "0 14px 30px -18px rgba(15, 23, 42, 0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
