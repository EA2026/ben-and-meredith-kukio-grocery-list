/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        manifest: {
          paper: "#FBF6EC",
          paperDark: "#F1E7D2",
          ink: "#152238",
          inkSoft: "#485468",
          lagoon: "#1B2A4E",
          lagoonDark: "#101B32",
          coral: "#A15A36",
          line: "#DED3BA",
        },
        horizon: {
          deep: "#1B2A4E",
          deep2: "#1B2A4E",
          mid: "#1B2A4E",
          gold: "#B0813E",
          goldSoft: "#D8B87E",
          coral: "#A15A36",
          cream: "#FBF6EC",
        },
        tropic: {
          gold: "#B0813E",
          plum: "#8B4A34",
          leaf: "#5C6E52",
          sky: "#46586B",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "Cambria", "serif"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(34,48,63,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
