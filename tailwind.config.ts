import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      md: "620px",
    },

    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      "neutral-grey": {
        100: "#FDFDFD",
        200: "#F8F8F8",
        300: "#F1F1F1",
        400: "#ECECED",
        500: "#E6E6E6",
        600: "#DCDCDE",
        700: "#ADACB0",
        800: "#ADACB0",
        900: "#7F7D83",
        1000: "#4F4D55",
        1100: "#2D2B32",
        1200: "#1D1C20",
        1300: "#0A090B",
      },
      blue: {
        100: "#FDFDFF",
        200: "#F5F8FD",
        300: "#EBF0FB",
        400: "#D6E0F7",
        500: "#B8CAF2",
        600: "#94B0EC",
        700: "#6C92E4",
        800: "#4272DD",
        900: "#1751D0",
        1000: "#113B98",
        1100: "#0C296A",
        1200: "#081B45",
        1300: "#051029",
      },
      green: {
        100: "#EBFBF1",
        200: "#E1FAEA",
        300: "#C1F4D4",
        400: "#91DDAD",
        500: "#63C888",
        600: "#3BBA6A",
        700: "#14AD4D",
        800: "#019939",
        900: "#018030",
        1000: "#016626",
        1100: "#004D1D",
        1200: "#102A19",
        1300: "#001A0A",
      },
      squash: {
        100: "#FFF6E7",
        200: "#FFF1DA",
        300: "#FFE9BA",
        400: "#FFD58F",
        500: "#FFC76A",
        600: "#FFB945",
        700: "#FFAB1F",
        800: "#EC980C",
        900: "#C47E0A",
        1000: "#9D6508",
        1100: "#764C06",
        1200: "#4F3304",
        1300: "#271902",
      },
      red: {
        100: "#FEEBEB",
        200: "#FFE3E3",
        300: "#FFC9C9",
        400: "#FAA4A4",
        500: "#FF7F7F",
        600: "#F75656",
        700: "#F53535",
        800: "#E12121",
        900: "#BC1C1C",
        1000: "#961616",
        1100: "#711111",
        1200: "#4B0B0B",
        1300: "#260606",
      },
      white: "#FFFFFF",
      black: "#000000",
    },
    fontFamily: {
      sans: ["Inter var", ...defaultTheme.fontFamily.sans],
    },
    fontSize: {
      "6xl": [
        "4.5rem",
        {
          lineHeight: "6.75rem",
          letterSpacing: "-0.03em",
        },
      ],
      "5xl": [
        "3.75rem",
        {
          lineHeight: "5.625rem",
          letterSpacing: "-0.03em",
        },
      ],
      "4xl": [
        "3rem",
        {
          lineHeight: "4.5rem",
          letterSpacing: "-0.03em",
        },
      ],
      "3xl": [
        "2.25rem",
        {
          lineHeight: "2.75rem",
          letterSpacing: "-0.03em",
        },
      ],
      "2xl": [
        "2rem",
        {
          lineHeight: "2.5rem",
          letterSpacing: "-0.03em",
        },
      ],
      xl: [
        "1.5rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.03em",
        },
      ],
      lg: [
        "1.25rem",
        {
          lineHeight: "1.75rem",
          letterSpacing: "-0.02em",
        },
      ],
      md: [
        "1.125rem",
        {
          lineHeight: "1.5rem",
          letterSpacing: "-0.26px",
        },
      ],
      base: [
        "1rem",
        {
          lineHeight: "1.375rem",
          letterSpacing: "-0.18px",
        },
      ],
      sm: [
        "0.875rem",
        {
          lineHeight: "1.25rem",
          letterSpacing: "-0.05px",
        },
      ],
      xs: [
        "0.8125rem",
        {
          lineHeight: "1.125rem",
          letterSpacing: "0px",
        },
      ],
      "2xs": [
        "0.75rem",
        {
          lineHeight: "1.125rem",
          letterSpacing: "0px",
        },
      ],
      "3xs": [
        "0.625rem",
        {
          lineHeight: "0.75rem",
          letterSpacing: "0px",
        },
      ],
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
