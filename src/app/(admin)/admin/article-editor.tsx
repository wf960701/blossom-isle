"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ArticleEditor({
  article,
}: {
  article?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_image: string;
    status: string;
    published_at: string;
  } | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!article;

  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [status, setStatus] = useState(article?.status || "draft");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (publishStatus?: string) => {
    setSaving(true);
    setError("");

    const finalStatus = publishStatus || status;
    const payload = {
      title,
      slug,
      content,
      excerpt,
      status: finalStatus,
      published_at:
        finalStatus === "published" && !article?.published_at
          ? new Date().toISOString()
          : article?.published_at,
    };

    let result;
    if (isEdit) {
      result = await supabase
        .from("articles")
        .update(payload)
        .eq("id", article!.id);
    } else {
      result = await supabase.from("articles").insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-rose-50 bg-rose-50/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(false)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              !preview
                ? "bg-white text-rose-600 shadow-sm"
                : "text-text-muted hover:text-rose-500"
            }`}
          >
            <i className="fa-regular fa-pen mr-1" />
            编辑
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              preview
                ? "bg-white text-rose-600 shadow-sm"
                : "text-text-muted hover:text-rose-500"
            }`}
          >
            <i className="fa-regular fa-eye mr-1" />
            预览
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg border border-rose-200 text-sm text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50"
          >
            {saving ? (
              <i className="fa-regular fa-spinner fa-spin" />
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk mr-1" />
                存草稿
              </>
            )}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {saving ? (
              <i className="fa-regular fa-spinner fa-spin" />
            ) : (
              <>
                <i className="fa-regular fa-cloud-upload mr-1" />
                发布
              </>
            )}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-5 py-3 border-b border-red-100">
          <i className="fa-regular fa-circle-exclamation" />
          {error}
        </div>
      )}

      {/* 内容区域 */}
      <div className="p-5 space-y-4">
        {/* 标题 */}
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="输入文章标题..."
          className="w-full text-2xl font-semibold text-text-primary placeholder-text-muted/40 border-none outline-none bg-transparent"
        />

        {/* Slug */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <i className="fa-regular fa-link" />
          <span>/articles/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            className="flex-1 px-2 py-1 rounded-lg bg-rose-50 border border-rose-100 outline-none focus:ring-2 focus:ring-rose-200 text-text-primary text-sm"
          />
        </div>

        {/* 摘要 */}
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="文章摘要（可选）..."
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-white/80 text-sm text-text-primary placeholder-text-muted/40 outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none"
        />

        {/* 分割 */}
        <div className="border-t border-rose-50" />

        {/* 正文编辑/预览 */}
        {preview ? (
          <div className="article-content min-h-[400px]">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-text-muted/40 text-center py-10">
                <i className="fa-regular fa-file-lines text-2xl block mb-2" />
                还没有内容
              </p>
            )}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始写文章...支持 Markdown 格式"
            rows={20}
            className="w-full font-mono text-sm leading-relaxed text-text-primary placeholder-text-muted/40 bg-transparent border-none outline-none resize-none"
          />
        )}
      </div>
    </div>
  );
}
