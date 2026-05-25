"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500 shadow-lg shadow-rose-200/50 flex items-center justify-center mb-4">
            <i className="fa-regular fa-pagoda text-2xl text-white/90" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">花屿管理</h1>
          <p className="text-sm text-text-muted mt-1">登录后管理你的知识花园</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <i className="fa-regular fa-envelope mr-1.5 text-rose-300" />
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all text-sm"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              <i className="fa-regular fa-lock mr-1.5 text-rose-300" />
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 px-4 py-2.5 rounded-xl">
              <i className="fa-regular fa-circle-exclamation" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium shadow-md shadow-rose-200/50 hover:shadow-lg hover:from-rose-500 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fa-regular fa-spinner fa-spin" />
                登录中...
              </>
            ) : (
              <>
                <i className="fa-regular fa-right-to-bracket" />
                登录
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-text-muted">
          <i className="fa-regular fa-shield mr-1" />
          仅管理员可访问
        </p>
      </div>
    </div>
  );
}
