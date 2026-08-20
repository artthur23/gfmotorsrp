"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1, "Informe a senha atual"),
  newPassword: z.string().min(8, "A nova senha precisa ter pelo menos 8 caracteres"),
});

export type ChangePasswordState = {
  ok: boolean;
  error?: string;
};

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sessão expirada. Faça login novamente." };

  const parsed = schema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user) return { ok: false, error: "Usuário não encontrado." };

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { ok: false, error: "Senha atual incorreta." };

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });

  return { ok: true };
}
