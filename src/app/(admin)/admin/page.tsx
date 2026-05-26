import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DeleteButton from "./delete-button";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: tags } = await supabase.from("tags").select("*");
  const { data: friends } = await supabase.from("friends").select("*");

  return (
    <div>
      {/* 概览卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-rose-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
              <i className="fa-regular fa-file-lines" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {articles?.length || 0}
              </p>
              <p className="text-xs text-text-muted">文章</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-rose-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500">
              <i className="fa-regular fa-tags" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {tags?.length || 0}
              </p>
              <p className="text-xs text-text-muted">标签</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-rose-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
              <i className="fa-regular fa-link" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {friends?.length || 0}
              </p>
              <p className="text-xs text-text-muted">友链</p>
            </div>
          </div>
        </div>
      </div>

      {/* 文章管理 */}
      <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-rose-50">
          <h2 className="font-semibold text-text-primary flex items-center gap-2">
            <i className="fa-regular fa-file-lines text-rose-400" />
            文章列表
          </h2>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            <i className="fa-regular fa-plus" />
            写文章
          </Link>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-regular fa-file-lines text-4xl text-rose-200 mb-3" />
            <p className="text-text-muted text-sm">还没有文章</p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1 mt-3 text-sm text-rose-500 hover:text-rose-700 transition-colors"
            >
              <i className="fa-regular fa-plus" />
              写第一篇
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-rose-50">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-rose-50/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="font-medium text-text-primary hover:text-rose-600 transition-colors"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        article.status === "published"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <i
                        className={`fa-regular ${
                          article.status === "published"
                            ? "fa-eye"
                            : "fa-pen"
                        }`}
                      />
                      {article.status === "published" ? "已发布" : "草稿"}
                    </span>
                    {article.published_at && (
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-calendar" />
                        {new Date(article.published_at).toLocaleDateString(
                          "zh-CN"
                        )}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-clock" />
                      {new Date(article.created_at).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all"
                    title="编辑"
                  >
                    <i className="fa-regular fa-pen-to-square text-sm" />
                  </Link>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all"
                    title="预览"
                    target="_blank"
                  >
                    <i className="fa-regular fa-eye text-sm" />
                  </Link>
                  <DeleteButton id={article.id} title={article.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
