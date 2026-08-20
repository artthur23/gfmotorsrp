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
  brand?: string;
  category?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
};

export async function getVehicles(filters: VehicleFilters = {}) {
  return prisma.vehicle.findMany({
    where: {
      status: { not: "VENDIDO" },
      ...(filters.brand ? { brand: filters.brand } : {}),
      ...(filters.category ? { category: filters.category as never } : {}),
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
      ...(filters.q
        ? {
            OR: [
              { brand: { contains: filters.q } },
              { model: { contains: filters.q } },
              { version: { contains: filters.q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: CARD_SELECT,
  });
}

export async function getVehicleCount() {
  return prisma.vehicle.count({ where: { status: { not: "VENDIDO" } } });
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
