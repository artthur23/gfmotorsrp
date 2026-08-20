"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { deleteUpload, saveUpload } from "@/lib/storage";

const vehicleSchema = z.object({
  brand: z.string().trim().min(1),
  model: z.string().trim().min(1),
  version: z.string().trim().optional(),
  yearFab: z.coerce.number().int().min(1900).max(2100),
  yearModel: z.coerce.number().int().min(1900).max(2100),
  km: z.coerce.number().int().min(0),
  price: z.coerce.number().int().min(0),
  fuel: z.enum(["FLEX", "GASOLINA", "DIESEL", "HIBRIDO", "ELETRICO"]),
  transmission: z.enum(["MANUAL", "AUTOMATICO", "AUTOMATIZADO"]),
  color: z.string().trim().optional(),
  category: z.enum([
    "HATCH",
    "SEDAN",
    "SUV",
    "PICAPE",
    "UTILITARIO",
    "CONVERSIVEL",
    "ESPORTIVO",
  ]),
  description: z.string().trim().optional(),
  features: z.array(z.string()).default([]),
  status: z.enum(["DISPONIVEL", "RESERVADO", "VENDIDO"]),
  featured: z.coerce.boolean().optional(),
});

function parseVehicleForm(formData: FormData) {
  const featuresRaw = (formData.get("features") as string | null) ?? "";
  const features = featuresRaw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  return vehicleSchema.parse({
    brand: formData.get("brand"),
    model: formData.get("model"),
    version: formData.get("version") || undefined,
    yearFab: formData.get("yearFab"),
    yearModel: formData.get("yearModel"),
    km: formData.get("km"),
    price: formData.get("price"),
    fuel: formData.get("fuel"),
    transmission: formData.get("transmission"),
    color: formData.get("color") || undefined,
    category: formData.get("category"),
    description: formData.get("description") || undefined,
    features,
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
  });
}

async function saveUploadedPhotos(vehicleId: string, files: File[]) {
  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length === 0) return;

  const existingCount = await prisma.vehiclePhoto.count({ where: { vehicleId } });

  for (const [index, file] of validFiles.entries()) {
    const url = await saveUpload(file);
    await prisma.vehiclePhoto.create({
      data: { vehicleId, url, order: existingCount + index },
    });
  }
}

export async function createVehicle(formData: FormData) {
  const data = parseVehicleForm(formData);
  const slug = slugify(`${data.brand}-${data.model}-${data.version ?? ""}-${data.yearModel}-${randomUUID().slice(0, 6)}`);

  const vehicle = await prisma.vehicle.create({
    data: { ...data, slug },
  });

  const files = formData.getAll("photos") as File[];
  await saveUploadedPhotos(vehicle.id, files);

  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath("/");
  redirect("/admin/veiculos");
}

export async function updateVehicle(vehicleId: string, formData: FormData) {
  const data = parseVehicleForm(formData);

  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data,
  });

  const files = formData.getAll("photos") as File[];
  await saveUploadedPhotos(vehicleId, files);

  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath(`/estoque/${vehicle.slug}`);
  revalidatePath("/");
  redirect("/admin/veiculos");
}

export async function deleteVehicle(vehicleId: string) {
  const [vehicle, photos] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { slug: true } }),
    prisma.vehiclePhoto.findMany({ where: { vehicleId } }),
  ]);
  await prisma.vehicle.delete({ where: { id: vehicleId } });

  for (const photo of photos) {
    await deleteUpload(photo.url);
  }

  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  if (vehicle) revalidatePath(`/estoque/${vehicle.slug}`);
  revalidatePath("/");
}

export async function deleteVehiclePhoto(photoId: string) {
  const photo = await prisma.vehiclePhoto.findUnique({
    where: { id: photoId },
    include: { vehicle: { select: { slug: true } } },
  });
  if (!photo) return;

  await prisma.vehiclePhoto.delete({ where: { id: photoId } });
  await deleteUpload(photo.url);

  revalidatePath("/admin/veiculos");
  revalidatePath("/estoque");
  revalidatePath(`/estoque/${photo.vehicle.slug}`);
  revalidatePath("/");
}
