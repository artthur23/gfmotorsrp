"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "", label: "Ordenar por" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "newest", label: "Mais novo" },
  { value: "km_asc", label: "Menor KM" },
];

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("sort", e.target.value);
    } else {
      params.delete("sort");
    }
    router.push(`/estoque?${params.toString()}`);
  }

  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        onChange={handleChange}
        className="appearance-none rounded-full border border-line-light bg-surface py-2.5 pl-4 pr-9 text-sm font-medium text-text-onlight outline-none focus:border-accent"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-onlight-dim"
      />
    </div>
  );
}
