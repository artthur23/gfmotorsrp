import { prisma } from "@/lib/db";

const CARD_SELECT = {
  slug: true,
  brand: true,
  model: true,
  version: true,
  yearFab: true,
  yearModel: true,
  km: true,
  price: true,
  fuel: true,
  transmission: true,
  status: true,
  photos: { orderBy: { order: "asc" as const }, take: 1, select: { url: true } },
};

export async function getFeaturedVehicles(limit = 4) {
  return prisma.vehicle.findMany({
    where: { featured: true, status: { not: "VENDIDO" } },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: CARD_SELECT,
  });
}

export type VehicleFilters = {
  brands?: string[];
  category?: string;
  transmissions?: string[];
  fuels?: string[];
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minKm?: number;
  maxKm?: number;
  q?: string;
  sort?: string;
};

const SORT_ORDER_BY: Record<string, { createdAt?: "asc" | "desc"; price?: "asc" | "desc"; yearModel?: "asc" | "desc"; km?: "asc" | "desc" }> = {
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  newest: { yearModel: "desc" },
  km_asc: { km: "asc" },
};

type FacetDimension = "brand" | "transmission" | "fuel";

function buildVehicleWhere(filters: VehicleFilters, exclude?: FacetDimension) {
  return {
    status: { not: "VENDIDO" as const },
    ...(exclude !== "brand" && filters.brands?.length ? { brand: { in: filters.brands } } : {}),
    ...(filters.category ? { category: filters.category as never } : {}),
    ...(exclude !== "transmission" && filters.transmissions?.length
      ? { transmission: { in: filters.transmissions as never[] } }
      : {}),
    ...(exclude !== "fuel" && filters.fuels?.length ? { fuel: { in: filters.fuels as never[] } } : {}),
    ...(filters.minYear || filters.maxYear
      ? {
          yearModel: {
            ...(filters.minYear ? { gte: filters.minYear } : {}),
            ...(filters.maxYear ? { lte: filters.maxYear } : {}),
          },
        }
      : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...(filters.minKm || filters.maxKm
      ? {
          km: {
            ...(filters.minKm ? { gte: filters.minKm } : {}),
            ...(filters.maxKm ? { lte: filters.maxKm } : {}),
          },
        }
      : {}),
    ...(filters.q
      ? {
          OR: [
            { brand: { contains: filters.q } },
            { model: { contains: filters.q } },
            { version: { contains: filters.q } },
          ],
        }
      : {}),
  };
}

export async function getVehicles(filters: VehicleFilters = {}) {
  return prisma.vehicle.findMany({
    where: buildVehicleWhere(filters),
    orderBy: (filters.sort && SORT_ORDER_BY[filters.sort]) || { createdAt: "desc" },
    select: CARD_SELECT,
  });
}

export async function getVehicleCount(filters: VehicleFilters = {}) {
  return prisma.vehicle.count({ where: buildVehicleWhere(filters) });
}

export async function getVehicleBrands() {
  const rows = await prisma.vehicle.findMany({
    where: { status: { not: "VENDIDO" } },
    distinct: ["brand"],
    select: { brand: true },
    orderBy: { brand: "asc" },
  });
  return rows.map((r) => r.brand);
}

/** Faixas reais (min/máx) de preço, ano e km do estoque ativo — usadas como limites dos sliders. */
export async function getVehicleStockBounds() {
  const agg = await prisma.vehicle.aggregate({
    where: { status: { not: "VENDIDO" } },
    _min: { price: true, yearModel: true, km: true },
    _max: { price: true, yearModel: true, km: true },
  });
  const currentYear = new Date().getFullYear();
  return {
    minPrice: agg._min.price ?? 0,
    maxPrice: agg._max.price ?? 0,
    minYear: agg._min.yearModel ?? currentYear,
    maxYear: agg._max.yearModel ?? currentYear,
    minKm: agg._min.km ?? 0,
    maxKm: agg._max.km ?? 0,
  };
}

/**
 * Contagem de veículos por marca/câmbio/combustível, cada uma calculada com os
 * demais filtros ativos aplicados (exceto a própria dimensão) — igual a
 * marketplaces com filtro à esquerda: marcar "Automático" não deve fazer a
 * própria opção "Automático" sumir da lista.
 */
export async function getVehicleFacets(filters: VehicleFilters = {}) {
  const [brandRows, transmissionRows, fuelRows] = await Promise.all([
    prisma.vehicle.groupBy({
      by: ["brand"],
      where: buildVehicleWhere(filters, "brand"),
      _count: { _all: true },
    }),
    prisma.vehicle.groupBy({
      by: ["transmission"],
      where: buildVehicleWhere(filters, "transmission"),
      _count: { _all: true },
    }),
    prisma.vehicle.groupBy({
      by: ["fuel"],
      where: buildVehicleWhere(filters, "fuel"),
      _count: { _all: true },
    }),
  ]);

  return {
    brands: Object.fromEntries(brandRows.map((r) => [r.brand, r._count._all])) as Record<string, number>,
    transmissions: Object.fromEntries(
      transmissionRows.map((r) => [r.transmission, r._count._all]),
    ) as Record<string, number>,
    fuels: Object.fromEntries(fuelRows.map((r) => [r.fuel, r._count._all])) as Record<string, number>,
  };
}

export async function getAllVehicleSlugs() {
  const rows = await prisma.vehicle.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getVehicleBySlug(slug: string) {
  return prisma.vehicle.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

export async function getSimilarVehicles(vehicle: { id: string; category: string }, limit = 3) {
  return prisma.vehicle.findMany({
    where: {
      id: { not: vehicle.id },
      category: vehicle.category as never,
      status: { not: "VENDIDO" },
    },
    take: limit,
    select: CARD_SELECT,
  });
}

export async function getSiteContent(key: string) {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  return row?.value ?? null;
}

export type Differential = { titulo: string; texto: string };

export async function getDifferentials(): Promise<Differential[]> {
  const raw = await getSiteContent("diferenciais");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Differential[];
  } catch {
    return [];
  }
}

export async function getApprovedTestimonials() {
  return prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDashboardStats() {
  const [vehiclesInStock, vehiclesSoldTotal, leadsThisMonth, newLeads] = await Promise.all([
    prisma.vehicle.count({ where: { status: { not: "VENDIDO" } } }),
    prisma.vehicle.count({ where: { status: "VENDIDO" } }),
    prisma.lead.count({
      where: { createdAt: { gte: new Date(new Date().setDate(1)) } },
    }),
    prisma.lead.count({ where: { status: "NOVO" } }),
  ]);

  return { vehiclesInStock, vehiclesSoldTotal, leadsThisMonth, newLeads };
}
