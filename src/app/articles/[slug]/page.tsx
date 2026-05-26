import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!article) notFound();

  const { data: articleTags } = await supabase
    .from("article_tags")
    .select("tag_id")
    .eq("article_id", article.id);

  const tagIds = articleTags?.map((t) => t.tag_id) || [];
  const { data: tags } = tagIds.length
    ? await supabase.from("tags").select("*").in("id", tagIds)
    : { data: [] };

  return (
    <article className="mx-auto max-w-4xl px-6 pt-12">
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
        <span className="text-text-secondary flex items-center gap-1">
          <i className="fa-regular fa-file-lines" />
          {article.title}
        </span>
      </nav>

      {/* 文章头部 */}
      <header className="mb-10">
        <h1 className="site-title text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
          {article.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-text-muted">
          {article.published_at && (
            <time
              dateTime={article.published_at}
              className="flex items-center gap-1.5"
            >
              <i className="fa-regular fa-calendar text-rose-300" />
              {new Date(article.published_at).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <i className="fa-regular fa-tags text-rose-300" />
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="tag-pill text-xs"
                >
                  <i className="fa-regular fa-hashtag mr-1" />
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 封面图 */}
      {article.cover_image && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-rose-50">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* 文章正文 */}
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* 底部导航 */}
      <div className="mt-16 pt-8 border-t border-rose-100 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors font-medium"
        >
          <i className="fa-regular fa-arrow-left" />
          返回首页
        </Link>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <i className="fa-regular fa-star" />
          读完啦
        </div>
      </div>
    </article>
  );
}
