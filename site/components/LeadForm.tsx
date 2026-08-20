"use client";

import { useActionState } from "react";
import { createLead, type CreateLeadState } from "@/lib/actions";

const initialState: CreateLeadState = { ok: false };

export function LeadForm({
  vehicleId,
  compact = false,
}: {
  vehicleId?: string;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(createLead, initialState);

  if (state.ok) {
    return (
      <div className="border border-line-light bg-surface p-5 text-sm text-text-onlight">
        Recebemos seus dados! Em breve alguém da GF Motors entra em contato — se preferir,
        pode chamar direto no WhatsApp.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {vehicleId && <input type="hidden" name="vehicleId" value={vehicleId} />}
      <div className={compact ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : "grid grid-cols-1 gap-3"}>
        <input
          type="text"
          name="name"
          required
          placeholder="Seu nome"
          className="border border-line-light bg-paper px-3 py-2 text-sm text-text-onlight placeholder:text-text-onlight-dim"
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Telefone / WhatsApp"
          className="border border-line-light bg-paper px-3 py-2 text-sm text-text-onlight placeholder:text-text-onlight-dim"
        />
      </div>
      <textarea
        name="message"
        rows={3}
        placeholder="Mensagem (opcional)"
        className="w-full border border-line-light bg-paper px-3 py-2 text-sm text-text-onlight placeholder:text-text-onlight-dim"
      />
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Solicitar informações"}
      </button>
    </form>
  );
}
