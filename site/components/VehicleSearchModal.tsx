"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { formatKm, formatPrice, vehicleTitle } from "@/lib/format";
import type { SearchableVehicle } from "@/lib/queries";

const MAX_RESULTS = 30;
const TRANSITION_MS = 200;

export function VehicleSearchModal({
  open,
  onClose,
  vehicles,
  brands,
}: {
  open: boolean;
  onClose: () => void;
  vehicles: SearchableVehicle[];
  brands: string[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Limpa a busca sempre que o modal (re)abre — ajuste de estado durante a
  // renderização, sem efeito, pra não disparar o lint de cascading renders.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  // Mantém o modal montado durante a animação de saída: `mounted` só vira
  // false depois que a transição de fechar termina, e `visible` controla
  // as classes que disparam a transição CSS de abrir/fechar. As duas
  // reações imediatas (montar ao abrir, esconder ao fechar) são ajuste de
  // estado durante a renderização; só o que depende de tempo (esperar um
  // frame pra animar a entrada, esperar a transição pra desmontar) precisa
  // de efeito de verdade.
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  if (open && !mounted) setMounted(true);
  if (!open && visible) setVisible(false);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    const terms = q.split(/\s+/);
    return vehicles.filter((v) => {
      const haystack = `${v.brand} ${v.model} ${v.version ?? ""} ${v.yearModel}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [vehicles, query]);

  const results = filtered.slice(0, MAX_RESULTS);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-sm transition-opacity duration-200 ease-out sm:pt-28 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-soft shadow-2xl transition-all duration-200 ease-out ${
          visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search size={18} className="shrink-0 text-text-ondark-dim" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por marca, modelo ou ano..."
            className="min-w-0 flex-1 bg-transparent text-sm text-text-ondark placeholder:text-text-ondark-dim focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="shrink-0 text-text-ondark-dim hover:text-text-ondark"
            >
              <X size={16} />
            </button>
          )}
          <span className="hidden shrink-0 rounded border border-white/15 px-1.5 py-0.5 font-data text-[10px] text-text-ondark-dim sm:inline">
            ESC
          </span>
        </div>

        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-white/10 px-5 py-3">
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setQuery((q) => (q.trim().toLowerCase() === b.toLowerCase() ? "" : b))}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  query.trim().toLowerCase() === b.toLowerCase()
                    ? "bg-accent text-white"
                    : "bg-white/10 text-text-ondark-dim hover:text-text-ondark"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        <p className="px-5 pt-3 font-data text-xs uppercase tracking-wide text-text-ondark-dim">
          {filtered.length} veículo{filtered.length === 1 ? "" : "s"} no estoque
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-ondark-dim">
              Nenhum veículo encontrado.
            </p>
          ) : (
            results.map((v) => (
              <Link
                key={v.slug}
                href={`/estoque/${v.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-ink">
                  <Image
                    src={v.photos[0]?.url ?? "/vehicle-placeholder.svg"}
                    alt=""
                    fill
                    quality={75}
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text-ondark">{vehicleTitle(v)}</p>
                  <p className="text-xs text-text-ondark-dim">
                    {v.yearModel} • {formatKm(v.km)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-extrabold text-text-ondark">
                  {formatPrice(v.price)}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
