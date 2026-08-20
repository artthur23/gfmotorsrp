import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth-actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-xs font-medium text-text-onlight-dim hover:text-accent"
      >
        <LogOut size={13} /> Sair
      </button>
    </form>
  );
}
