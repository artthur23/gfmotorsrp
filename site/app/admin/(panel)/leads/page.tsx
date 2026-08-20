import { prisma } from "@/lib/db";
import { vehicleTitle } from "@/lib/format";
import { LeadStatusSelect } from "./LeadStatusSelect";

export const metadata = { title: "Leads" };

const SOURCE_LABELS: Record<string, string> = {
  SITE: "Site",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  TELEFONE: "Telefone",
  OUTRO: "Outro",
};

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { brand: true, model: true, version: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text-onlight">Leads</h1>

      <div className="overflow-x-auto border border-line-light bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line-light text-xs uppercase tracking-wide text-text-onlight-dim">
            <tr>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Veículo</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Recebido em</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-light">
            {leads.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-text-onlight">{l.name}</p>
                  <p className="text-xs text-text-onlight-dim">{l.phone}</p>
                  {l.message && (
                    <p className="mt-1 max-w-xs text-xs text-text-onlight-dim">{l.message}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-text-onlight-dim">
                  {l.vehicle ? vehicleTitle(l.vehicle) : "—"}
                </td>
                <td className="px-4 py-3 text-text-onlight-dim">{SOURCE_LABELS[l.source]}</td>
                <td className="px-4 py-3 font-data text-xs text-text-onlight-dim">
                  {l.createdAt.toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3">
                  <LeadStatusSelect leadId={l.id} status={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="p-6 text-sm text-text-onlight-dim">Nenhum lead recebido ainda.</p>
        )}
      </div>
    </div>
  );
}
