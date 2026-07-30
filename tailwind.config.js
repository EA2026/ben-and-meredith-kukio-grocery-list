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
          paper: "#EFE8D8",
          paperDark: "#E1D7BE",
          ink: "#1B2B33",
          inkSoft: "#3E5164",
          lagoon: "#2D6E78",
          lagoonDark: "#1F4E56",
          coral: "#BE5A3C",
          line: "#C7BC9E",
        },
        horizon: {
          deep: "#0F2A38",
          deep2: "#153A4A",
          mid: "#1F5563",
          gold: "#E3A857",
          goldSoft: "#F0C888",
          coral: "#E3714B",
          cream: "#F3ECDB",
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
