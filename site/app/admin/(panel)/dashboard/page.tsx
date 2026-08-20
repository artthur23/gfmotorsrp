import Link from "next/link";
import { Car, CheckCircle2, MessageSquare, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { getDashboardStats } from "@/lib/queries";
import { formatPrice, statusLabel, vehicleTitle } from "@/lib/format";

export const metadata = { title: "Dashboard" };

const CARDS = [
  { key: "vehiclesInStock", label: "Veículos em estoque", icon: Car },
  { key: "newLeads", label: "Leads novos", icon: MessageSquare },
  { key: "leadsThisMonth", label: "Leads no mês", icon: Users },
  { key: "vehiclesSoldTotal", label: "Vendidos (total)", icon: CheckCircle2 },
] as const;

export default async function DashboardPage() {
  const [stats, recentLeads, recentVehicles] = await Promise.all([
    getDashboardStats(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { vehicle: { select: { brand: true, model: true } } },
    }),
    prisma.vehicle.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text-onlight">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c.key} className="border border-line-light bg-surface p-5">
            <c.icon size={18} className="mb-3 text-accent" />
            <p className="font-display text-2xl font-extrabold text-text-onlight">
              {stats[c.key]}
            </p>
            <p className="text-xs text-text-onlight-dim">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-line-light bg-surface">
          <div className="flex items-center justify-between border-b border-line-light px-5 py-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
              Leads recentes
            </h2>
            <Link href="/admin/leads" className="text-xs text-accent hover:underline">
              Ver todos
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="p-5 text-sm text-text-onlight-dim">Nenhum lead ainda.</p>
          ) : (
            <ul className="divide-y divide-line-light">
              {recentLeads.map((l) => (
                <li key={l.id} className="px-5 py-3 text-sm">
                  <p className="font-medium text-text-onlight">{l.name}</p>
                  <p className="text-xs text-text-onlight-dim">
                    {l.phone}
                    {l.vehicle ? ` · ${l.vehicle.brand} ${l.vehicle.model}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-line-light bg-surface">
          <div className="flex items-center justify-between border-b border-line-light px-5 py-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
              Veículos recentes
            </h2>
            <Link href="/admin/veiculos" className="text-xs text-accent hover:underline">
              Ver todos
            </Link>
          </div>
          {recentVehicles.length === 0 ? (
            <p className="p-5 text-sm text-text-onlight-dim">Nenhum veículo cadastrado.</p>
          ) : (
            <ul className="divide-y divide-line-light">
              {recentVehicles.map((v) => (
                <li key={v.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium text-text-onlight">{vehicleTitle(v)}</p>
                    <p className="text-xs text-text-onlight-dim">
                      {statusLabel(v.status)} · {formatPrice(v.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
