import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "花屿 - 个人知识花园",
  description: "记录思考与成长，种下一座属于自己的知识花园",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-sky-50 to-white antialiased">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
