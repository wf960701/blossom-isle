import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: configRows } = await supabase
    .from("site_config")
    .select("*");

  const config: Record<string, string> = {};
  configRows?.forEach((r) => (config[r.key] = r.value));

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <i className="fa-regular fa-gear text-rose-400" />
        <h1 className="text-lg font-semibold text-text-primary">站点设置</h1>
      </div>

      <div className="bg-white rounded-2xl border border-rose-50 shadow-sm p-6">
        <SettingsForm config={config} />
      </div>
    </div>
  );
}
