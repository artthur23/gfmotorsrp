"use client";

import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "@/lib/user-actions";

const initialState: ChangePasswordState = { ok: false };
const INPUT =
  "w-full border border-line-light bg-paper px-3 py-2 text-sm text-text-onlight";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-3">
      <input
        type="password"
        name="currentPassword"
        required
        placeholder="Senha atual"
        className={INPUT}
      />
      <input
        type="password"
        name="newPassword"
        required
        placeholder="Nova senha (mín. 8 caracteres)"
        className={INPUT}
      />
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Senha atualizada.</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Alterar senha"}
      </button>
    </form>
  );
}
