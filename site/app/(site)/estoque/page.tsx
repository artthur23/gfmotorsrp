import Link from "next/link";
import { Search } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { SortSelect } from "@/components/SortSelect";
import { VehicleFiltersPanel } from "@/components/VehicleFiltersPanel";
import {
  getVehicleBrands,
  getVehicleCount,
  getVehicleFacets,
  getVehicleStockBounds,
  getVehicles,
} from "@/lib/queries";
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from "@/lib/options";

export const metadata = { title: "Estoque" };

function toInt(value: string | string[] | undefined) {
  if (!value || Array.isArray(value)) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function toStr(value: string | string[] | undefined) {
  if (!value || Array.isArray(value) || value === "") return undefined;
  return value;
}

function toArr(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

const PILLS = [
  { label: "Todos", href: "/estoque" },
  { label: "SUVs", href: "/estoque?category=SUV" },
  { label: "Sedãs", href: "/estoque?category=SEDAN" },
  { label: "Hatches", href: "/estoque?category=HATCH" },
  { label: "Picapes", href: "/estoque?category=PICAPE" },
  { label: "Utilitários", href: "/estoque?category=UTILITARIO" },
  { label: "Automáticos", href: "/estoque?transmission=AUTOMATICO" },
  { label: "Até R$ 60 mil", href: "/estoque?maxPrice=60000" },
];

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = {
    brands: toArr(sp.brand),
    category: toStr(sp.category),
    transmissions: toArr(sp.transmission),
    fuels: toArr(sp.fuel),
    minYear: toInt(sp.minYear),
    maxPrice: toInt(sp.maxPrice),
    maxKm: toInt(sp.maxKm),
    q: toStr(sp.q),
    sort: toStr(sp.sort),
  };

  const [vehicles, matchingCount, brands, bounds, facets, totalCount] = await Promise.all([
    getVehicles(filters),
    getVehicleCount(filters),
    getVehicleBrands(),
    getVehicleStockBounds(),
    getVehicleFacets(filters),
    getVehicleCount(),
  ]);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    !!filters.category ||
    filters.transmissions.length > 0 ||
    filters.fuels.length > 0 ||
    !!filters.minYear ||
    !!filters.maxPrice ||
    !!filters.maxKm ||
    !!filters.q;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-6">
        <p className="font-data text-xs uppercase tracking-widest text-accent">Estoque</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-text-onlight">
          Todos os veículos
        </h1>
      </div>

      {/* Pills de categoria */}
      <div className="mb-8 flex flex-wrap gap-2">
        {PILLS.map((pill) => {
          const active =
            (pill.href === "/estoque" && !hasActiveFilters) ||
            (pill.href.includes("category=") && filters.category && pill.href.endsWith(filters.category)) ||
            (pill.href.includes("transmission=AUTOMATICO") &&
              filters.transmissions.length === 1 &&
              filters.transmissions[0] === "AUTOMATICO") ||
            (pill.href.includes("maxPrice=60000") && filters.maxPrice === 60000);

          return (
            <Link
              key={pill.label}
              href={pill.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-accent text-white"
                  : "bg-ink text-text-ondark-dim hover:text-text-ondark"
              }`}
            >
              {pill.label}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <VehicleFiltersPanel
          brands={brands}
          transmissionOptions={TRANSMISSION_OPTIONS}
          fuelOptions={FUEL_OPTIONS}
          facets={facets}
          bounds={bounds}
          initial={{
            brands: filters.brands,
            transmissions: filters.transmissions,
            fuels: filters.fuels,
            maxPrice: filters.maxPrice ?? null,
            minYear: filters.minYear ?? null,
            maxKm: filters.maxKm ?? null,
          }}
          matchingCount={matchingCount}
        />

        {/* Conteúdo */}
        <div id="resultados">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form method="get" className="relative flex-1 sm:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-onlight-dim"
              />
              <input
                type="text"
                name="q"
                defaultValue={filters.q ?? ""}
                placeholder="Buscar marca ou modelo..."
                className="w-full rounded-full border border-line-light bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent"
              />
              {filters.category && <input type="hidden" name="category" value={filters.category} />}
              {filters.sort && <input type="hidden" name="sort" value={filters.sort} />}
            </form>

            <div className="flex items-center gap-3">
              <span className="text-sm text-text-onlight-dim">{matchingCount} veículos</span>
              <SortSelect defaultValue={filters.sort ?? ""} />
            </div>
          </div>

          {totalCount === 0 ? (
            <p className="py-16 text-center text-sm text-text-onlight-dim">
              Nenhum veículo cadastrado no momento.
            </p>
          ) : vehicles.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-onlight-dim">
              Nenhum veículo encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard key={v.slug} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
