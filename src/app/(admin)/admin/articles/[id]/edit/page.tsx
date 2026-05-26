import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ArticleEditor from "../../../article-editor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <i className="fa-regular fa-pen-to-square text-rose-400" />
        <h1 className="text-lg font-semibold text-text-primary">编辑文章</h1>
        <span className="text-xs text-text-muted ml-auto">
          <i className="fa-regular fa-circle-info mr-1" />
          支持 Markdown 格式
        </span>
      </div>
      <ArticleEditor article={article} />
    </div>
  );
}
