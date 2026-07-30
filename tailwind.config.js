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
          paper: "#EAE3D2",
          paperDark: "#DCD3BC",
          ink: "#22303F",
          inkSoft: "#3E5164",
          lagoon: "#2D6E78",
          lagoonDark: "#1F4E56",
          coral: "#BE5A3C",
          line: "#C7BC9E",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(34,48,63,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
