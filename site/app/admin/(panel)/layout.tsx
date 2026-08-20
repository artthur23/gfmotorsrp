import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Car, Users, FileText, Settings, ExternalLink } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/veiculos", label: "Veículos", icon: Car },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line-light bg-surface lg:flex">
        <div className="px-5 py-6">
          <p className="font-display text-base font-extrabold tracking-wide text-text-onlight">
            GF MOTORS
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 text-xs text-text-onlight-dim hover:text-accent"
          >
            Visitar o site <ExternalLink size={11} />
          </a>
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-onlight-dim transition-colors hover:bg-paper hover:text-text-onlight"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line-light px-5 py-4">
          <p className="text-sm font-medium text-text-onlight">{session.name}</p>
          <p className="mb-3 truncate text-xs text-text-onlight-dim">{session.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1">
        <main className="mx-auto max-w-5xl px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
