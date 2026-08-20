"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(30),
  message: z.string().trim().max(1000).optional(),
  vehicleId: z.string().optional(),
  source: z.enum(["SITE", "WHATSAPP", "INSTAGRAM", "TELEFONE", "OUTRO"]).default("SITE"),
});

export type CreateLeadState = {
  ok: boolean;
  error?: string;
};

export async function createLead(
  _prevState: CreateLeadState,
  formData: FormData,
): Promise<CreateLeadState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message") || undefined,
    vehicleId: formData.get("vehicleId") || undefined,
    source: "SITE",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await prisma.lead.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      message: parsed.data.message,
      vehicleId: parsed.data.vehicleId || undefined,
      source: parsed.data.source,
    },
  });

  return { ok: true };
}
