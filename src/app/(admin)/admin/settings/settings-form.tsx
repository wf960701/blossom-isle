"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const FIELDS = [
  { key: "site_name", label: "站点名称", icon: "fa-regular fa-signature" },
  { key: "site_description", label: "站点描述", icon: "fa-regular fa-quote-left" },
  { key: "site_keywords", label: "关键词（逗号分隔）", icon: "fa-regular fa-key" },
];

export default function SettingsForm({
  config,
}: {
  config: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>({ ...config });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    for (const field of FIELDS) {
      const val = values[field.key] || "";
      if (config[field.key] !== undefined) {
        await supabase
          .from("site_config")
          .update({ value: val })
          .eq("key", field.key);
      } else {
        await supabase.from("site_config").insert({ key: field.key, value: val });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
            <i className={`${field.icon} text-rose-300`} />
            {field.label}
          </label>
          <input
            type="text"
            value={values[field.key] || ""}
            onChange={(e) =>
              setValues({ ...values, [field.key]: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-white/80 text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
          saved
            ? "bg-green-500 text-white"
            : "bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
        }`}
      >
        {saved ? (
          <>
            <i className="fa-regular fa-check" />
            已保存
          </>
        ) : saving ? (
          <>
            <i className="fa-regular fa-spinner fa-spin" />
            保存中...
          </>
        ) : (
          <>
            <i className="fa-regular fa-floppy-disk" />
            保存设置
          </>
        )}
      </button>
    </div>
  );
}
