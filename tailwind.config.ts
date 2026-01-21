import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",

        // 👇👇👇 必须要有这一行！👇👇👇
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            // === 这里是新增的动画配置 ===
            keyframes: {
                // 1. 星星闪烁
                twinkle: {
                    '0%, 100%': { opacity: '0.3', transform: 'scale(0.8) rotate(0deg)' },
                    '50%': { opacity: '1', transform: 'scale(1.2) rotate(180deg)' },
                },
                // 2. 星星下落 (从屏幕上方落到下方)
                fall: {
                    '0%': { transform: 'translateY(-10vh) translateX(-5vw)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { transform: 'translateY(110vh) translateX(5vw)', opacity: '0' },
                },
                // 3. 月亮浮动
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                }
            },
            animation: {
                twinkle: 'twinkle 3s ease-in-out infinite',
                fall: 'fall 10s linear infinite',
                float: 'float 6s ease-in-out infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;