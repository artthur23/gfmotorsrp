import { VehicleCard } from "@/components/VehicleCard";
import { getVehicleBrands, getVehicles } from "@/lib/queries";
import { CATEGORY_OPTIONS } from "@/lib/options";

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

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = {
    brand: toStr(sp.brand),
    category: toStr(sp.category),
    minYear: toInt(sp.minYear),
    maxYear: toInt(sp.maxYear),
    minPrice: toInt(sp.minPrice),
    maxPrice: toInt(sp.maxPrice),
    q: toStr(sp.q),
  };

  const [vehicles, brands] = await Promise.all([getVehicles(filters), getVehicleBrands()]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <p className="font-data text-xs uppercase tracking-widest text-accent">Estoque</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-text-onlight">
          Todos os veículos
        </h1>
      </div>

      <form
        method="get"
        className="mb-10 grid grid-cols-2 gap-3 rounded-2xl border border-line-light bg-surface p-5 sm:grid-cols-3 lg:grid-cols-6"
      >
        <input
          type="text"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Buscar marca/modelo"
          className="col-span-2 rounded-lg border border-line-light bg-paper px-3 py-2 text-sm lg:col-span-2"
        />
        <select
          name="brand"
          defaultValue={filters.brand ?? ""}
          className="rounded-lg border border-line-light bg-paper px-3 py-2 text-sm"
        >
          <option value="">Marca</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-lg border border-line-light bg-paper px-3 py-2 text-sm"
        >
          <option value="">Categoria</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minPrice"
          defaultValue={filters.minPrice ?? ""}
          placeholder="Preço mín."
          className="rounded-lg border border-line-light bg-paper px-3 py-2 text-sm"
        />
        <input
          type="number"
          name="maxPrice"
          defaultValue={filters.maxPrice ?? ""}
          placeholder="Preço máx."
          className="rounded-lg border border-line-light bg-paper px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="col-span-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong sm:col-span-1 lg:col-span-6"
        >
          Filtrar
        </button>
      </form>

      {vehicles.length === 0 ? (
        <p className="py-16 text-center text-sm text-text-onlight-dim">
          Nenhum veículo encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      )}
    </section>
  );
}
