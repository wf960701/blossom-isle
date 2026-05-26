import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TagFilterPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const supabase = await createClient();

  const { data: tagInfo } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", tag)
    .single();

  if (!tagInfo) notFound();

  const { data: articleTags } = await supabase
    .from("article_tags")
    .select("article_id")
    .eq("tag_id", tagInfo.id);

  const articleIds = articleTags?.map((at) => at.article_id) || [];

  const { data: articles } = articleIds.length
    ? await supabase
        .from("articles")
        .select("*")
        .in("id", articleIds)
        .eq("status", "published")
        .order("published_at", { ascending: false })
    : { data: [] };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-12">
      {/* 面包屑 */}
      <nav className="mb-8 text-sm text-text-muted flex items-center gap-2">
        <Link
          href="/"
          className="hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          <i className="fa-regular fa-leaf" />
          首页
        </Link>
        <i className="fa-regular fa-chevron-right text-xs" />
        <Link
          href="/tags"
          className="hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          <i className="fa-regular fa-tags" />
          标签
        </Link>
        <i className="fa-regular fa-chevron-right text-xs" />
        <span className="text-rose-500 font-medium">{tagInfo.name}</span>
      </nav>

      {/* 标签头部 */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-rose-50 rounded-full border border-rose-100 shadow-sm">
          <i className="fa-regular fa-tag text-rose-400" />
          <h1 className="text-xl font-semibold text-rose-700">
            {tagInfo.name}
          </h1>
          <span className="text-sm text-text-muted bg-white/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <i className="fa-regular fa-file-lines" />
            {articles?.length || 0}
          </span>
        </div>
        <p className="mt-4 text-text-secondary flex items-center gap-1.5">
          <i className="fa-regular fa-magnifying-glass text-rose-300" />
          所有标记为「{tagInfo.name}」的文章
        </p>
      </header>

      {/* 文章列表 */}
      {!articles || articles.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-regular fa-tag text-5xl text-rose-200 mb-4" />
          <p className="text-text-secondary flex items-center justify-center gap-1">
            <i className="fa-regular fa-face-sad-tear" />
            该标签下还没有文章
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group card-hover bg-white rounded-xl p-5 border border-rose-50 shadow-sm animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-3">
                <i className="fa-regular fa-file-lines text-rose-300 mt-1" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-text-primary group-hover:text-rose-600 transition-colors">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-1.5 text-text-secondary text-sm line-clamp-1">
                      {article.excerpt}
                    </p>
                  )}
                  {article.published_at && (
                    <time className="mt-2 block text-xs text-text-muted flex items-center gap-1">
                      <i className="fa-regular fa-calendar" />
                      {new Date(article.published_at).toLocaleDateString(
                        "zh-CN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                  )}
                </div>
                <i className="fa-regular fa-arrow-right text-rose-200 group-hover:text-rose-400 group-hover:translate-x-1 transition-all mt-1.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
