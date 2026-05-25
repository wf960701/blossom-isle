import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function TagsPage() {
  const supabase = await createClient();

  const { data: tags } = await supabase.from("tags").select("*");
  const { data: articleTags } = await supabase.from("article_tags").select("*");

  const countMap: Record<number, number> = {};
  articleTags?.forEach((at) => {
    countMap[at.tag_id] = (countMap[at.tag_id] || 0) + 1;
  });

  return (
    <div className="mx-auto max-w-4xl px-6 pt-12">
      {/* 面包屑 */}
      <nav className="mb-10 text-sm text-text-muted flex items-center gap-2">
        <Link
          href="/"
          className="hover:text-rose-500 transition-colors flex items-center gap-1"
        >
          <i className="fa-regular fa-leaf" />
          首页
        </Link>
        <i className="fa-regular fa-chevron-right text-xs" />
        <span className="flex items-center gap-1">
          <i className="fa-regular fa-tags" />
          标签
        </span>
      </nav>

      {/* 页面头部 */}
      <header className="mb-12 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xl mb-4 shadow-sm">
          <i className="fa-regular fa-tags text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">所有标签</h1>
        <p className="mt-2 text-text-secondary text-sm flex items-center justify-center gap-1">
          <i className="fa-regular fa-spreadsheet text-rose-300" />
          共 {tags?.length || 0} 个标签
        </p>
      </header>

      {/* 标签网格 */}
      {!tags || tags.length === 0 ? (
        <div className="text-center py-16">
          <i className="fa-light fa-tags text-5xl text-rose-200 mb-4" />
          <p className="text-text-secondary">还没有标签哦</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, i) => {
            const count = countMap[tag.id] || 0;
            return (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="tag-pill animate-fade-in text-base px-5 py-2 gap-2"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <i className="fa-regular fa-hashtag text-rose-300 text-xs" />
                {tag.name}
                <span className="text-xs text-text-muted bg-white/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <i className="fa-regular fa-file-lines" />
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* 底部返回 */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-rose-500 transition-colors"
        >
          <i className="fa-regular fa-arrow-left" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
