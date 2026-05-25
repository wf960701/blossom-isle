import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const { data: tags } = await supabase.from("tags").select("*");

  const { data: configRows } = await supabase
    .from("site_config")
    .select("*");
  const config: Record<string, string> = {};
  configRows?.forEach((r) => (config[r.key] = r.value));

  return (
    <div>
      {/* ===== 顶部英雄区 ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-rose-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-radial from-pink-200/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
          {/* 头像 */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500 shadow-lg shadow-rose-200/50 flex items-center justify-center">
            <i className="fa-duotone fa-solid fa-tree-palm text-3xl text-white/90" />
          </div>

          {/* 标题 */}
          <h1 className="site-title text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400 bg-clip-text text-transparent">
              {config.site_name || "花屿"}
            </span>
          </h1>

          {/* 描述 */}
          <p className="mt-4 text-lg text-text-secondary max-w-lg mx-auto leading-relaxed flex items-center justify-center gap-2">
            <i className="fa-regular fa-feather text-rose-300" />
            {config.site_description ||
              "记录思考与成长，种下一座属于自己的知识花园"}
            <i className="fa-regular fa-feather text-rose-300 fa-flip-horizontal" />
          </p>

          {/* 装饰分隔 */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-rose-300" />
            <i className="fa-regular fa-sparkle text-rose-300 text-lg" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-rose-300" />
          </div>

          {/* 统计指示 */}
          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-text-muted">
            <div className="flex items-center gap-1.5">
              <i className="fa-regular fa-file-lines text-rose-300" />
              <span>{articles?.length || 0} 篇文章</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-regular fa-tags text-rose-300" />
              <span>{tags?.length || 0} 个标签</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 标签云 ===== */}
      {tags && tags.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-100/50 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-regular fa-cloud text-rose-400 text-sm" />
              <h2 className="text-sm font-medium text-text-secondary tracking-wider uppercase">
                标签云
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {tags.map((tag, i) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="tag-pill animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <i className="fa-regular fa-hashtag mr-1.5 text-rose-300 text-xs" />
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== 文章列表 ===== */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="flex items-center gap-2 mb-8">
          <i className="fa-regular fa-pen-to-square text-rose-400" />
          <h2 className="text-base font-medium text-text-secondary tracking-wider uppercase">
            最新文章
          </h2>
          <span className="h-px flex-1 bg-gradient-to-r from-rose-200 to-transparent" />
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-20">
            <i className="fa-light fa-seedling text-5xl text-rose-200 mb-6" />
            <p className="text-text-secondary text-lg">花园还在播种中</p>
            <p className="text-text-muted text-sm mt-2 flex items-center justify-center gap-1">
              <i className="fa-regular fa-pen"></i>
              还没有文章哦，先去种点什么吧~
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {articles.map((article, i) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group card-hover block bg-white rounded-2xl p-6 sm:p-7 border border-rose-50 shadow-sm animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <article>
                  <div className="flex items-start gap-4">
                    {/* 序号装饰 */}
                    <span className="hidden sm:flex mt-1 w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 items-center justify-center text-xs font-bold text-rose-400 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-text-primary group-hover:text-rose-600 transition-colors leading-snug">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mt-2 text-text-secondary leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                        {article.published_at && (
                          <time
                            dateTime={article.published_at}
                            className="flex items-center gap-1"
                          >
                            <i className="fa-regular fa-calendar" />
                            {new Date(
                              article.published_at
                            ).toLocaleDateString("zh-CN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        )}
                        <span className="text-rose-200">·</span>
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-book-open text-rose-300" />
                          阅读全文
                        </span>
                      </div>
                    </div>

                    <span className="hidden sm:flex mt-2 text-rose-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all">
                      <i className="fa-regular fa-arrow-right" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== 底部装饰 ===== */}
      <div className="mx-auto max-w-4xl px-6 mt-16 text-center">
        <i className="fa-regular fa-ellipsis text-text-muted/30 text-lg" />
      </div>
    </div>
  );
}
