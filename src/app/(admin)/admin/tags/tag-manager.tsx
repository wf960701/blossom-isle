"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function TagManager() {
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const generateSlug = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleAdd = async () => {
    if (!name.trim()) return;
    setAdding(true);
    setError("");

    const { error: err } = await supabase.from("tags").insert({
      name: name.trim(),
      slug: generateSlug(name),
    });

    if (err) {
      setError(err.message);
    } else {
      setName("");
      router.refresh();
    }
    setAdding(false);
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="输入标签名，回车添加..."
          className="w-full px-4 py-2 rounded-xl border border-rose-100 bg-white text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all"
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <i className="fa-regular fa-circle-exclamation" />
            {error}
          </p>
        )}
      </div>
      <button
        onClick={handleAdd}
        disabled={adding || !name.trim()}
        className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center gap-1"
      >
        <i className="fa-regular fa-plus" />
        添加
      </button>
    </div>
  );
}
