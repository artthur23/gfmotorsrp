import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice, statusLabel, vehicleTitle } from "@/lib/format";
import { DeleteVehicleButton } from "./DeleteVehicleButton";

export const metadata = { title: "Veículos" };

export default async function VeiculosPage() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text-onlight">Veículos</h1>
        <Link
          href="/admin/veiculos/novo"
          className="flex items-center gap-1.5 bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
        >
          <Plus size={15} /> Novo veículo
        </Link>
      </div>

      <div className="overflow-x-auto border border-line-light bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line-light text-xs uppercase tracking-wide text-text-onlight-dim">
            <tr>
              <th className="px-4 py-3">Veículo</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Destaque</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-medium text-text-onlight">{vehicleTitle(v)}</td>
                <td className="px-4 py-3 font-data text-text-onlight">{formatPrice(v.price)}</td>
                <td className="px-4 py-3 text-text-onlight-dim">{statusLabel(v.status)}</td>
                <td className="px-4 py-3 text-text-onlight-dim">{v.featured ? "Sim" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/veiculos/${v.id}`}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteVehicleButton vehicleId={v.id} vehicleTitle={vehicleTitle(v)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehicles.length === 0 && (
          <p className="p-6 text-sm text-text-onlight-dim">Nenhum veículo cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
