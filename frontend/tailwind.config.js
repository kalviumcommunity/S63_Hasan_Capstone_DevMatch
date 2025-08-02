/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'base-100': 'oklch(25.33% 0.016 252.42)',
        'base-200': 'oklch(23.26% 0.014 253.1)',
        'base-300': 'oklch(21.15% 0.012 254.09)',
        'base-content': 'oklch(97.807% 0.029 256.847)',
        'primary': 'oklch(58% 0.233 277.117)',
        'primary-content': 'oklch(96% 0.018 272.314)',
        'secondary': 'oklch(65% 0.241 354.308)',
        'secondary-content': 'oklch(94% 0.028 342.258)',
        'accent': 'oklch(77% 0.152 181.912)',
        'accent-content': 'oklch(38% 0.063 188.416)',
        'neutral': 'oklch(14% 0.005 285.823)',
        'neutral-content': 'oklch(92% 0.004 286.32)',
        'info': 'oklch(74% 0.16 232.661)',
        'info-content': 'oklch(29% 0.066 243.157)',
        'success': 'oklch(76% 0.177 163.223)',
        'success-content': 'oklch(37% 0.077 168.94)',
        'warning': 'oklch(82% 0.189 84.429)',
        'warning-content': 'oklch(41% 0.112 45.904)',
        'error': 'oklch(71% 0.194 13.428)',
        'error-content': 'oklch(27% 0.105 12.094)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
} 