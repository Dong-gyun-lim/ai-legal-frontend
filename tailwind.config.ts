import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class', // ✅ 다크모드 활성화 (필수)
    content: ['./app/**/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    light: '#F8F5F2',
                    dark: '#2C3E50',
                    accent: '#7B5E57',
                },
            },
        },
    },
    plugins: [],
};

export default config;
