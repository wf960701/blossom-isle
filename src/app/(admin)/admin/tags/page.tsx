import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TagManager from "./tag-manager";

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  const { data: articleTags } = await supabase.from("article_tags").select("*");

  // 统计每篇文章数
  const countMap: Record<number, number> = {};
  articleTags?.forEach((at) => {
    countMap[at.tag_id] = (countMap[at.tag_id] || 0) + 1;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <i className="fa-regular fa-tags text-rose-400" />
          标签管理
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-rose-50 bg-rose-50/20">
          <TagManager />
        </div>

        {!tags || tags.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-light fa-tags text-4xl text-rose-200 mb-3" />
            <p className="text-text-muted text-sm">还没有标签</p>
          </div>
        ) : (
          <div className="divide-y divide-rose-50">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <i className="fa-regular fa-hashtag" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{tag.name}</p>
                  <p className="text-xs text-text-muted">
                    /tags/{tag.slug}
                  </p>
                </div>
                <span className="text-xs text-text-muted bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <i className="fa-regular fa-file-lines" />
                  {countMap[tag.id] || 0} 篇文章
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
