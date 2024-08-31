import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
	container: {
		center: true,
		padding: "2rem",
		screens: {
			"2xl": "1400px",
		}
	},
	fontFamily:	{
		primary: "var(--font-marcellus)",
		secondary: "var(--font-urbanist)"
	},
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
		  primary: {
		  	DEFAULT: '#292836',
		  	hover: '#3e3d4a',
		  },
		  secondary: {
			  DEFAULT : '#6b6a71',
		  },
			accent: {
			  DEFAULT: '#e85f4c',
			  hover: '#ea6f5e',
			},
			tertiary: {
			  DEFAULT: '#faf5ef',
			},
			grey: {
			  DEFAULT: '#a09faf',
			}
		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
