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
          ink: "#12261F",
          inkSoft: "#3F5C4F",
          lagoon: "#0B6E64",
          lagoonDark: "#084F48",
          coral: "#FF6F4C",
          line: "#E3D9C2",
        },
        horizon: {
          deep: "#0B6E64",
          deep2: "#B23A6B",
          mid: "#FF6F4C",
          gold: "#F4B740",
          goldSoft: "#FBD988",
          coral: "#FF6F4C",
          cream: "#FBF6EC",
        },
        tropic: {
          gold: "#F4B740",
          plum: "#B23A6B",
          leaf: "#5B8C3A",
          sky: "#3E8FB0",
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
