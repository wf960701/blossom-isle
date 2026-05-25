import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ArticleEditor from "../article-editor";

export default async function NewArticlePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <i className="fa-regular fa-pen-to-square text-rose-400" />
        <h1 className="text-lg font-semibold text-text-primary">写文章</h1>
        <span className="text-xs text-text-muted ml-auto">
          <i className="fa-regular fa-circle-info mr-1" />
          支持 Markdown 格式
        </span>
      </div>
      <ArticleEditor />
    </div>
  );
}
