import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FriendsPage() {
  const supabase = await createClient();

  const { data: friends } = await supabase
    .from("friends")
    .select("*")
    .order("sort_order");

  return (
    <div>
      {/* ===== 面包屑导航 ===== */}
      <section className="mx-auto max-w-4xl px-6 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link
            href="/"
            className="hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <i className="fa-regular fa-tree" />
            首页
          </Link>
          <i className="fa-regular fa-chevron-right text-xs text-rose-200" />
          <span className="text-text-secondary flex items-center gap-1">
            <i className="fa-regular fa-link" />
            友链
          </span>
        </nav>
      </section>

      {/* ===== 顶部英雄区 ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-transparent" />
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-gradient-radial from-rose-200/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-gradient-radial from-pink-200/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 pt-10 pb-12 text-center">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500 shadow-lg shadow-rose-200/50 flex items-center justify-center">
            <i className="fa-solid fa-link text-2xl text-white/90" />
          </div>

          <h1 className="site-title text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 bg-clip-text text-transparent">
              友情链接
            </span>
          </h1>

          <p className="mt-3 text-text-secondary max-w-lg mx-auto leading-relaxed flex items-center justify-center gap-2">
            <i className="fa-regular fa-feather text-rose-300" />
            在网络的角落里，遇见志同道合的朋友
            <i className="fa-regular fa-feather text-rose-300 fa-flip-horizontal" />
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-rose-300" />
            <i className="fa-regular fa-star text-rose-300 text-lg" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-rose-300" />
          </div>

          {friends && friends.length > 0 && (
            <div className="mt-6 text-sm text-text-muted flex items-center justify-center gap-1.5">
              <i className="fa-regular fa-handshake text-rose-300" />
              <span>
                共 <strong className="text-rose-500">{friends.length}</strong>{" "}
                位好友
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ===== 友链卡片区 ===== */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        {!friends || friends.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex w-20 h-20 rounded-full bg-rose-50 items-center justify-center mb-6">
              <i className="fa-regular fa-handshake text-4xl text-rose-200" />
            </div>
            <p className="text-text-secondary text-lg">还没有好友</p>
            <p className="text-text-muted text-sm mt-2 flex items-center justify-center gap-1">
              <i className="fa-regular fa-pen"></i>
              期待与你相遇~
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-5 py-2.5 rounded-full"
            >
              <i className="fa-regular fa-arrow-left" />
              返回首页
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {friends.map((friend, i) => (
              <a
                key={friend.id}
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group card-hover block bg-white rounded-2xl p-6 border border-rose-50 shadow-sm animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* 头像 */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-rose-400 shrink-0 overflow-hidden">
                    {friend.avatar ? (
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-rose-400">
                        {friend.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-rose-600 transition-colors truncate">
                        {friend.name}
                      </h3>
                      <span className="shrink-0 text-rose-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <i className="fa-regular fa-arrow-up-right-from-square text-xs" />
                      </span>
                    </div>

                    {friend.description && (
                      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {friend.description}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-text-muted truncate flex items-center gap-1">
                      <i className="fa-regular fa-globe text-rose-200" />
                      {friend.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 底部回到首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-rose-500 transition-colors px-5 py-2.5 rounded-full hover:bg-rose-50"
          >
            <i className="fa-regular fa-arrow-left" />
            返回首页
            <i className="fa-regular fa-tree text-rose-300" />
          </Link>
        </div>
      </section>

      {/* 底部装饰 */}
      <div className="mx-auto max-w-4xl px-6 text-center">
        <i className="fa-regular fa-ellipsis text-text-muted/30 text-lg" />
      </div>
    </div>
  );
}
