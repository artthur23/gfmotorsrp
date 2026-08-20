"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/auth-actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-text-ondark-dim">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="w-full border border-line-dark bg-ink px-3 py-2 text-sm text-text-ondark"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-text-ondark-dim">
          Senha
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-line-dark bg-ink px-3 py-2 text-sm text-text-ondark"
        />
      </div>
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
