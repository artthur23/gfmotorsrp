import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Fuel, Gauge, Palette, Settings2 } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { LeadForm } from "@/components/LeadForm";
import { VehicleGallery } from "@/components/VehicleGallery";
import { getSimilarVehicles, getVehicleBySlug } from "@/lib/queries";
import {
  categoryLabel,
  formatKm,
  formatPrice,
  fuelLabel,
  transmissionLabel,
  vehicleTitle,
  vehicleWhatsappMessage,
  whatsappLink,
} from "@/lib/format";

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const similar = await getSimilarVehicles(vehicle);
  const photos =
    vehicle.photos.length > 0
      ? vehicle.photos
      : [{ id: "placeholder", url: "/vehicle-placeholder.svg" }];

  const specs = [
    { icon: Calendar, label: "Ano", value: `${vehicle.yearFab}/${vehicle.yearModel}` },
    { icon: Gauge, label: "Quilometragem", value: formatKm(vehicle.km) },
    { icon: Settings2, label: "Câmbio", value: transmissionLabel(vehicle.transmission) },
    { icon: Fuel, label: "Combustível", value: fuelLabel(vehicle.fuel) },
    ...(vehicle.color ? [{ icon: Palette, label: "Cor", value: vehicle.color }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="mb-6 text-xs text-text-onlight-dim">
        <Link href="/estoque" className="hover:text-accent">
          Estoque
        </Link>{" "}
        / <span>{vehicleTitle(vehicle)}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_.9fr]">
        <div className="min-w-0">
          <VehicleGallery photos={photos} title={vehicleTitle(vehicle)} />

          {vehicle.description && (
            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-text-onlight">Descrição</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-onlight-dim">
                {vehicle.description}
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="font-data text-xs uppercase tracking-widest text-accent">
            {categoryLabel(vehicle.category)}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-text-onlight">
            {vehicleTitle(vehicle)}
          </h1>
          <p className="mt-3 font-display text-3xl font-extrabold text-accent">
            {formatPrice(vehicle.price)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-line-light bg-surface p-5">
            {specs.map((s) => (
              <div key={s.label} className="flex items-start gap-2">
                <s.icon size={16} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-onlight-dim">
                    {s.label}
                  </p>
                  <p className="text-sm font-medium text-text-onlight">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={whatsappLink(vehicleWhatsappMessage(vehicle))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            Falar no WhatsApp sobre esse veículo
          </a>

          <div className="mt-6">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
              Ou deixe seus dados
            </h2>
            <LeadForm vehicleId={vehicle.id} />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-onlight">
            Veículos semelhantes
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
