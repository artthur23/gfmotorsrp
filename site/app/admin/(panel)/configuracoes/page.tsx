import { getSession } from "@/lib/auth";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const session = await getSession();

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-text-onlight">Configurações</h1>

      <section className="border border-line-light bg-surface p-6">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
          Sua conta
        </h2>
        <p className="text-sm text-text-onlight-dim">
          {session?.name} · {session?.email}
        </p>
      </section>

      <section className="border border-line-light bg-surface p-6">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
          Alterar senha
        </h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
