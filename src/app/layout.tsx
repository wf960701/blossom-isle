import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata: Metadata = {
  title: "花屿 - 个人知识花园",
  description: "记录思考与成长，种下一座属于自己的知识花园",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {/* 花瓣飘落装饰 */}
        <PetalAnim />

        {/* 导航栏 */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-rose-100/50">
          <nav className="mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="site-title text-xl font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <i className="fa-regular fa-pagoda mr-2 text-rose-400 text-lg" />
              花屿
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-text-secondary hover:text-rose-600 transition-colors flex items-center gap-1.5"
              >
                <i className="fa-regular fa-leaf" />
                首页
              </Link>
              <Link
                href="/tags"
                className="text-text-secondary hover:text-rose-600 transition-colors flex items-center gap-1.5"
              >
                <i className="fa-regular fa-tags" />
                标签
              </Link>
            </div>
          </nav>
        </header>

        {/* 主内容 */}
        <main className="relative z-10">{children}</main>

        {/* 底部 */}
        <footer className="relative z-10 mt-20 border-t border-rose-100/50">
          <div className="mx-auto max-w-4xl px-6 py-10 text-center">
            <p className="text-sm text-text-muted flex items-center justify-center gap-2">
              <i className="fa-regular fa-pagoda text-rose-300" />
              花屿 · 种一座属于自己的知识花园
            </p>
            <p className="mt-3 text-xs text-text-muted/60 flex items-center justify-center gap-1.5">
              <i className="fa-regular fa-seedling" />
              Powered by Next.js & Supabase
              <i className="fa-regular fa-sparkles" />
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

/* 花瓣动画组件 */
function PetalAnim() {
  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    size: `${8 + Math.random() * 10}px`,
    duration: `${18 + Math.random() * 25}s`,
    delay: `${Math.random() * 18}s`,
    opacity: 0.12 + Math.random() * 0.18,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
