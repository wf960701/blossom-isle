import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const navItems = [
    { href: "/admin", label: "文章管理", icon: "fa-regular fa-file-lines" },
    { href: "/admin/tags", label: "标签管理", icon: "fa-regular fa-tags" },
    { href: "/admin/friends", label: "友链管理", icon: "fa-regular fa-link" },
    { href: "/admin/settings", label: "站点设置", icon: "fa-regular fa-gear" },
  ];

  return (
    <div className="min-h-screen bg-rose-50/30">
      {/* 顶栏 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-rose-100/50">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-rose-600 font-semibold"
            >
              <i className="fa-regular fa-tree" />
              <span>花屿管理</span>
            </Link>
            <span className="text-xs text-text-muted bg-rose-50 px-2 py-0.5 rounded-full">
              后台
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-text-muted hover:text-rose-500 transition-colors flex items-center gap-1"
              target="_blank"
            >
              <i className="fa-regular fa-arrow-up-right-from-square" />
              查看站点
            </Link>
            <span className="text-xs text-text-muted">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 flex gap-8">
        {/* 侧边栏 */}
        <aside className="w-48 shrink-0">
          <nav className="space-y-1 sticky top-20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-rose-600 hover:bg-rose-50 transition-all"
              >
                <i className={`${item.icon} w-4 text-rose-300`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主内容 */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
