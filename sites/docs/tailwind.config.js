// @ts-check
import { fontFamily } from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}", "./content/**/*.md"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "1.5rem",
				lg: "2rem",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				brand: {
					DEFAULT: "hsl(var(--brand) / <alpha-value>)",
					hover: "hsl(var(--brand-hover) / <alpha-value>)",
				},
				success: "hsl(var(--success) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
			},
			maxWidth: {
				"8xl": "90rem",
			},
			typography: {
				DEFAULT: {
					css: {
						"code::before": {
							content: "",
						},
						"code::after": {
							content: "",
						},
					},
				},
			},
			scale: {
				98: ".98",
			},
			animation: {
				"spin-slow": "spin 4s linear infinite",
			},
		},
	},
	plugins: [typography],
};

export default config;
