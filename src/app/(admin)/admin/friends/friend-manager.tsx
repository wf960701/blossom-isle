"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function FriendManager() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAdd = async () => {
    if (!name.trim() || !url.trim()) return;
    setAdding(true);
    setError("");

    const { error: err } = await supabase.from("friends").insert({
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || null,
    });

    if (err) {
      setError(err.message);
    } else {
      setName("");
      setUrl("");
      setDescription("");
      router.refresh();
    }
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="站点名称 *"
          className="px-4 py-2 rounded-xl border border-rose-100 bg-white text-sm outline-none focus:ring-2 focus:ring-rose-200"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="站点链接 *"
          className="px-4 py-2 rounded-xl border border-rose-100 bg-white text-sm outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="简介（可选）"
          className="flex-1 px-4 py-2 rounded-xl border border-rose-100 bg-white text-sm outline-none focus:ring-2 focus:ring-rose-200"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !name.trim() || !url.trim()}
          className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center gap-1"
        >
          <i className="fa-regular fa-plus" />
          添加
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <i className="fa-regular fa-circle-exclamation" />
          {error}
        </p>
      )}
    </div>
  );
}
