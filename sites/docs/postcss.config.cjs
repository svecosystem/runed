const path = require("node:path");
const tailwindcss = require("tailwindcss");
const tailwindcssNesting = require("tailwindcss/nesting");
const autoprefixer = require("autoprefixer");

const config = {
	plugins: [
		tailwindcssNesting,
		tailwindcss(path.resolve(__dirname, "tailwind.config.js")),
		autoprefixer,
	],
};

module.exports = config;
