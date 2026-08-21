"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="rounded-full border border-line-light bg-surface px-4 py-2.5 text-sm font-medium text-text-onlight outline-none focus:border-accent"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
