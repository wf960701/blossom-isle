import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // 获取已发布的文章（先试试能不能连上 Supabase）
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // 获取标签
  const { data: tags } = await supabase.from("tags").select("*");

  // 获取站点配置
  const { data: configRows } = await supabase
    .from("site_config")
    .select("*");

  const config: Record<string, string> = {};
  configRows?.forEach((row) => (config[row.key] = row.value));

  return (
    <div>
      {/* 头部 */}
      <header className="mb-12 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blossom-sky to-blossom-pink text-3xl shadow-lg shadow-blossom-sky/20">
          🌸
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          {config.site_name || "花屿"}
        </h1>
        <p className="mt-2 text-gray-500">
          {config.site_description || "个人知识花园，记录思考与成长"}
        </p>
      </header>

      {/* 标签云 */}
      {tags && tags.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
            标签云
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="rounded-full bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-blossom-sky hover:text-white hover:shadow-md hover:ring-blossom-sky"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 文章列表 */}
      <section>
        {!articles || articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center">
            <p className="text-5xl mb-4">🌱</p>
            <p className="text-gray-400 text-lg">花园还在播种中，还没有文章哦</p>
            <p className="text-gray-300 text-sm mt-2">先去后台写点什么吧~</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-blossom-sky/30"
              >
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blossom-sky transition-colors">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="mt-2 text-gray-500 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                {article.published_at && (
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(article.published_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 底部 */}
      <footer className="mt-16 border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
        <p>Powered by 花屿 🌸</p>
      </footer>
    </div>
  );
}
