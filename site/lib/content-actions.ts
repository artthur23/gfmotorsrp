"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function updateSobreEmpresa(formData: FormData) {
  const text = z.string().trim().min(1).parse(formData.get("sobre_empresa"));
  await prisma.siteContent.upsert({
    where: { key: "sobre_empresa" },
    update: { value: text },
    create: { key: "sobre_empresa", value: text },
  });
  revalidatePath("/");
  revalidatePath("/empresa");
  revalidatePath("/admin/conteudo");
}

const MAX_DIFFERENTIALS = 6;

export async function updateDiferenciais(formData: FormData) {
  const items: { titulo: string; texto: string }[] = [];
  for (let i = 0; i < MAX_DIFFERENTIALS; i++) {
    const titulo = (formData.get(`titulo_${i}`) as string | null)?.trim();
    const texto = (formData.get(`texto_${i}`) as string | null)?.trim();
    if (titulo) items.push({ titulo, texto: texto ?? "" });
  }

  await prisma.siteContent.upsert({
    where: { key: "diferenciais" },
    update: { value: JSON.stringify(items) },
    create: { key: "diferenciais", value: JSON.stringify(items) },
  });
  revalidatePath("/");
  revalidatePath("/empresa");
  revalidatePath("/admin/conteudo");
}

export async function createTestimonial(formData: FormData) {
  const authorName = z.string().trim().min(1).parse(formData.get("authorName"));
  const text = z.string().trim().min(1).parse(formData.get("text"));
  const rating = z.coerce.number().int().min(1).max(5).parse(formData.get("rating"));

  await prisma.testimonial.create({
    data: { authorName, text, rating, approved: true },
  });
  revalidatePath("/");
  revalidatePath("/admin/conteudo");
}

export async function toggleTestimonialApproval(id: string, approved: boolean) {
  await prisma.testimonial.update({ where: { id }, data: { approved } });
  revalidatePath("/");
  revalidatePath("/admin/conteudo");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/conteudo");
}
