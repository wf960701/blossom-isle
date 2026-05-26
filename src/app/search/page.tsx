"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/lib/database.types";

export default function SearchPage() {
  const supabase = createClient();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动聚焦搜索框
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      setLoading(true);
      setSearched(true);

      try {
        // 使用 Supabase 全文搜索（search_vector tsvector 列）
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .textSearch("search_vector", trimmed, {
            type: "websearch",
            config: "simple",
          })
          .order("published_at", { ascending: false });

        if (error) {
          console.error("搜索出错:", error);
          setResults([]);
        } else {
          setResults(data || []);
        }
      } catch (err) {
        console.error("搜索异常:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query, supabase]
  );

  // 高亮搜索关键词
  const highlightText = (text: string, keyword: string): string => {
    if (!keyword.trim()) return text;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-rose-200/70 text-rose-800 rounded-sm px-0.5">$1</mark>'
    );
  };

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
          <i className="fa-regular fa-magnifying-glass" />
          搜索
        </span>
      </nav>

      {/* 页面头部 */}
      <header className="mb-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xl mb-4 shadow-sm">
          <i className="fa-regular fa-search text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">搜索文章</h1>
        <p className="mt-2 text-text-secondary text-sm flex items-center justify-center gap-1">
          <i className="fa-regular fa-star text-rose-300" />
          在花屿中探寻你感兴趣的内容
        </p>
      </header>

      {/* 搜索框 */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <i className="fa-regular fa-search text-rose-300 text-lg" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词搜索文章…"
            className="w-full pl-12 pr-36 py-4 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 disabled:from-rose-200 disabled:to-pink-200 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <i className="fa-regular fa-spinner-third fa-spin" />
                  搜索中…
                </>
              ) : (
                <>
                  <i className="fa-regular fa-search" />
                  搜索
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 搜索结果 */}
      <section>
        {searched && !loading && (
          <div className="flex items-center gap-2 mb-6">
            <i
              className={`fa-regular ${
                results.length > 0 ? "fa-circle-check text-emerald-400" : "fa-circle-exclamation text-rose-300"
              }`}
            />
            <h2 className="text-sm font-medium text-text-secondary">
              共找到 <span className="text-rose-500 font-semibold">{results.length}</span> 篇相关文章
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-rose-200 to-transparent" />
          </div>
        )}

        {/* 初始状态 - 未搜索 */}
        {!searched && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center mb-6 shadow-inner">
              <i className="fa-regular fa-magnifying-glass text-4xl text-rose-200" />
            </div>
            <p className="text-text-secondary text-lg">输入关键词开始搜索</p>
            <p className="text-text-muted text-sm mt-2 flex items-center justify-center gap-1">
              <i className="fa-regular fa-pen" />
              试试搜索你感兴趣的话题
            </p>
          </div>
        )}

        {/* 加载中 */}
        {loading && (
          <div className="text-center py-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-rose-300 animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-3 h-3 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: "0.3s" }} />
            </div>
            <p className="text-text-muted text-sm">
              <i className="fa-regular fa-spinner-third fa-spin mr-2" />
              正在花屿中搜寻…
            </p>
          </div>
        )}

        {/* 搜索结果为空 */}
        {searched && !loading && results.length === 0 && (
          <div className="text-center py-16">
            <i className="fa-regular fa-map-pin text-5xl text-rose-200 mb-5" />
            <p className="text-text-secondary text-lg">没有找到匹配的文章</p>
            <p className="text-text-muted text-sm mt-2 flex items-center justify-center gap-1">
              <i className="fa-regular fa-face-sad-tear" />
              换个关键词试试吧~
            </p>
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
                inputRef.current?.focus();
              }}
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 transition-colors font-medium"
            >
              <i className="fa-regular fa-arrow-left" />
              重新搜索
            </button>
          </div>
        )}

        {/* 搜索结果列表 */}
        {searched && !loading && results.length > 0 && (
          <div className="grid gap-4">
            {results.map((article, i) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group card-hover bg-white rounded-2xl p-5 sm:p-6 border border-rose-50 shadow-sm animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <article>
                  <div className="flex items-start gap-3">
                    <span className="hidden sm:flex mt-1 w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 items-center justify-center text-xs font-bold text-rose-400 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg sm:text-xl font-semibold text-text-primary group-hover:text-rose-600 transition-colors leading-snug"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(article.title, query),
                        }}
                      />
                      {article.excerpt && (
                        <p
                          className="mt-2 text-text-secondary leading-relaxed line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(article.excerpt, query),
                          }}
                        />
                      )}
                      <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                        {article.published_at && (
                          <time
                            dateTime={article.published_at}
                            className="flex items-center gap-1"
                          >
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

      {/* 底部装饰 */}
      <div className="mx-auto max-w-4xl px-6 mt-16 text-center">
        <i className="fa-regular fa-ellipsis text-text-muted/30 text-lg" />
      </div>
    </div>
  );
}
