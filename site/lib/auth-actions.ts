"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { error: "E-mail ou senha incorretos." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createSession({ userId: user.id, email: user.email, name: user.name });

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/admin") ? next : "/admin/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
