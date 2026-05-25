"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      alert("删除失败：" + error.message);
      return;
    }
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all"
          title="确认删除"
        >
          <i className="fa-regular fa-check text-sm" />
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all"
          title="取消"
        >
          <i className="fa-regular fa-xmark text-sm" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-400 hover:bg-red-50 hover:text-red-500 transition-all"
      title="删除"
    >
      <i className="fa-regular fa-trash-can text-sm" />
    </button>
  );
}
