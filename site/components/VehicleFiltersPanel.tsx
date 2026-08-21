"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { formatKm, formatPrice } from "@/lib/format";

type Bounds = {
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  minKm: number;
  maxKm: number;
};

type Facets = {
  brands: Record<string, number>;
  transmissions: Record<string, number>;
  fuels: Record<string, number>;
};

type FilterState = {
  brands: string[];
  transmissions: string[];
  fuels: string[];
  maxPrice: number | null;
  minYear: number | null;
  maxKm: number | null;
};

const EMPTY_STATE: FilterState = {
  brands: [],
  transmissions: [],
  fuels: [],
  maxPrice: null,
  minYear: null,
  maxKm: null,
};

export function VehicleFiltersPanel({
  brands,
  transmissionOptions,
  fuelOptions,
  facets,
  bounds,
  initial,
  matchingCount,
}: {
  brands: string[];
  transmissionOptions: { value: string; label: string }[];
  fuelOptions: { value: string; label: string }[];
  facets: Facets;
  bounds: Bounds;
  initial: FilterState;
  matchingCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<FilterState>(initial);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ressincroniza quando a mudança de filtro vem de fora deste painel (pills
  // de categoria, busca, botão voltar do navegador) — padrão de "ajustar
  // estado quando uma prop muda" durante a renderização, sem efeito.
  const initialKey = JSON.stringify(initial);
  const [syncedKey, setSyncedKey] = useState(initialKey);
  if (initialKey !== syncedKey) {
    setSyncedKey(initialKey);
    setState(initial);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigate(next: FilterState) {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("brand");
    next.brands.forEach((b) => params.append("brand", b));

    params.delete("transmission");
    next.transmissions.forEach((t) => params.append("transmission", t));

    params.delete("fuel");
    next.fuels.forEach((f) => params.append("fuel", f));

    if (next.maxPrice != null && next.maxPrice < bounds.maxPrice) {
      params.set("maxPrice", String(next.maxPrice));
    } else {
      params.delete("maxPrice");
    }

    if (next.minYear != null && next.minYear > bounds.minYear) {
      params.set("minYear", String(next.minYear));
    } else {
      params.delete("minYear");
    }

    if (next.maxKm != null && next.maxKm < bounds.maxKm) {
      params.set("maxKm", String(next.maxKm));
    } else {
      params.delete("maxKm");
    }

    const query = params.toString();
    const url = query ? `/estoque?${query}` : "/estoque";
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  function update(partial: Partial<FilterState>, opts: { debounce?: boolean } = {}) {
    const next = { ...state, ...partial };
    setState(next);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (opts.debounce) {
      debounceRef.current = setTimeout(() => navigate(next), 350);
    } else {
      navigate(next);
    }
  }

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function handleApplyClick() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      navigate(state);
    }
    setMobileOpen(false);
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleClear() {
    setState(EMPTY_STATE);
    navigate(EMPTY_STATE);
  }

  const activeCount =
    state.brands.length +
    state.transmissions.length +
    state.fuels.length +
    (state.maxPrice != null ? 1 : 0) +
    (state.minYear != null ? 1 : 0) +
    (state.maxKm != null ? 1 : 0);

  const priceValue = state.maxPrice ?? bounds.maxPrice;
  const yearValue = state.minYear ?? bounds.minYear;
  const kmValue = state.maxKm ?? bounds.maxKm;

  return (
    <aside className="h-fit rounded-3xl border border-line-dark bg-ink text-text-ondark lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        aria-expanded={mobileOpen}
        aria-controls="filtros-painel"
        className="flex w-full items-center justify-between p-6 lg:pointer-events-none lg:cursor-default"
      >
        <span className="font-display text-xl font-bold">
          Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </span>
        <ChevronDown
          size={18}
          className={`text-text-ondark-dim transition-transform lg:hidden ${mobileOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div id="filtros-painel" className={`${mobileOpen ? "block" : "hidden"} px-6 pb-6 lg:block`}>
        <div className="divide-y divide-line-dark">
          <FilterSection title="Marca" defaultOpen>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              {brands.map((b) => (
                <CheckboxRow
                  key={b}
                  label={b}
                  count={facets.brands[b] ?? 0}
                  checked={state.brands.includes(b)}
                  onChange={() => update({ brands: toggle(state.brands, b) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Preço" defaultOpen>
            <RangeRow
              ariaLabel="Preço máximo"
              min={bounds.minPrice}
              max={bounds.maxPrice}
              value={priceValue}
              onChange={(v) => update({ maxPrice: v }, { debounce: true })}
              label={priceValue >= bounds.maxPrice ? "Sem limite" : `Até ${formatPrice(priceValue)}`}
            />
          </FilterSection>

          <FilterSection title="Ano" defaultOpen>
            <RangeRow
              ariaLabel="Ano mínimo"
              min={bounds.minYear}
              max={bounds.maxYear}
              value={yearValue}
              onChange={(v) => update({ minYear: v }, { debounce: true })}
              label={`A partir de ${yearValue}`}
            />
          </FilterSection>

          <FilterSection title="Quilometragem" defaultOpen>
            <RangeRow
              ariaLabel="Quilometragem máxima"
              min={bounds.minKm}
              max={bounds.maxKm}
              value={kmValue}
              onChange={(v) => update({ maxKm: v }, { debounce: true })}
              label={kmValue >= bounds.maxKm ? "Até sem limite" : `Até ${formatKm(kmValue)}`}
            />
          </FilterSection>

          <FilterSection title="Câmbio" defaultOpen>
            <div className="flex flex-col gap-2">
              {transmissionOptions.map((t) => (
                <CheckboxRow
                  key={t.value}
                  label={t.label}
                  count={facets.transmissions[t.value] ?? 0}
                  checked={state.transmissions.includes(t.value)}
                  onChange={() => update({ transmissions: toggle(state.transmissions, t.value) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Combustível" defaultOpen>
            <div className="flex flex-col gap-2">
              {fuelOptions.map((f) => (
                <CheckboxRow
                  key={f.value}
                  label={f.label}
                  count={facets.fuels[f.value] ?? 0}
                  checked={state.fuels.includes(f.value)}
                  onChange={() => update({ fuels: toggle(state.fuels, f.value) })}
                />
              ))}
            </div>
          </FilterSection>
        </div>

        <div className="pt-5">
          <button
            type="button"
            onClick={handleApplyClick}
            className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-70"
            disabled={isPending}
          >
            Ver {matchingCount} veículo{matchingCount === 1 ? "" : "s"}
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-3 block w-full text-center text-xs text-text-ondark-dim hover:text-text-ondark"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="group py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        {title}
        <ChevronDown
          size={16}
          className="text-text-ondark-dim transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-sm text-text-ondark-dim">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="rounded border-line-dark accent-accent"
        />
        {label}
      </span>
      <span className="font-data text-xs">{count}</span>
    </label>
  );
}

function RangeRow({
  ariaLabel,
  min,
  max,
  value,
  onChange,
  label,
}: {
  ariaLabel: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const disabled = min >= max;
  const pct = disabled ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div>
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-accent"
        style={{
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${pct}%, var(--color-line-dark) ${pct}%, var(--color-line-dark) 100%)`,
        }}
      />
      <p className="mt-2 text-sm font-medium text-text-ondark">{label}</p>
    </div>
  );
}
