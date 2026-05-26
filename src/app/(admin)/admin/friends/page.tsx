import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FriendManager from "./friend-manager";

export default async function AdminFriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: friends } = await supabase
    .from("friends")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <i className="fa-regular fa-link text-rose-400" />
          友链管理
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-rose-50 bg-rose-50/20">
          <FriendManager />
        </div>

        {!friends || friends.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-regular fa-link text-4xl text-rose-200 mb-3" />
            <p className="text-text-muted text-sm">还没有友链</p>
          </div>
        ) : (
          <div className="divide-y divide-rose-50">
            {friends.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                  <i className="fa-regular fa-link" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary">{f.name}</p>
                  <p className="text-xs text-text-muted truncate">{f.url}</p>
                  {f.description && (
                    <p className="text-xs text-text-muted/60 mt-0.5">
                      {f.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-text-muted bg-rose-50 px-2 py-1 rounded-full">
                  排序: {f.sort_order}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
