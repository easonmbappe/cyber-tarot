import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 👇👇👇 修改这里 👇👇👇
export const metadata: Metadata = {
  // 1. 修改浏览器标签页上的文字
  title: "Tarot",

  // 2. 修改搜索引擎看到的描述
  description: "基于 DeepSeek 模型的沉浸式塔罗占卜体验，探索过去、现在与未来。",

  // 3. 修改左上角的小图标 (这里用了一个把 Emoji 转成图标的免费服务)
  icons: {
    icon: "https://emojicdn.elk.sh/🔮",
    // 如果你喜欢别的，可以把 🔮 换成 🌟, 🌙, 🃏 等任何 Emoji
  },
};
// 👆👆👆 修改结束 👆👆👆

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}