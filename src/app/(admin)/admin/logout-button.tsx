"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-text-muted hover:text-rose-500 transition-colors flex items-center gap-1"
    >
      <i className="fa-regular fa-sign-out" />
      退出
    </button>
  );
}
