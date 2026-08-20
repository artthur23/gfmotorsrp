"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const VALID_STATUSES = ["NOVO", "EM_NEGOCIACAO", "VENDIDO", "PERDIDO"] as const;

export async function updateLeadStatus(leadId: string, status: string) {
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Status inválido");
  }
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: status as (typeof VALID_STATUSES)[number] },
  });
  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");
}
