import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'sm': '640px',
            'md': '1136px', // Mobile view until 1136px
            'lg': '1280px',
            'xl': '1536px',
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#A37B2C', // Pantone 132 C
                    50: '#FDFBF7',
                    100: '#F9F5E8',
                    200: '#EEDDAA',
                    300: '#DFC280', // ~60% tint approximation
                    400: '#C8B080', // Pantone 132 C (60%)
                    500: '#A37B2C', // Pantone 132 C (100%)
                    600: '#8A6825',
                    700: '#72551E',
                    800: '#5C4418',
                    900: '#453312',
                    950: '#2A1F0B'
                },
                secondary: {
                    DEFAULT: '#000000', // Black 100%
                    50: '#F2F2F2',
                    100: '#E6E6E6',
                    200: '#CCCCCC',
                    300: '#B3B3B3',
                    400: '#999999',
                    500: '#808080',
                    600: '#666666',
                    700: '#4D4D4D',
                    800: '#333333', // Black 80%
                    900: '#1A1A1A',
                    950: '#000000'
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
export default config;
