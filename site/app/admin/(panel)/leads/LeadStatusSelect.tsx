"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/lead-actions";
import { STATUS_OPTIONS } from "./status-options";

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        startTransition(async () => {
          await updateLeadStatus(leadId, e.target.value);
          router.refresh();
        });
      }}
      className="border border-line-light bg-paper px-2 py-1 text-xs text-text-onlight disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
