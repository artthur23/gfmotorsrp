import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CheckCircle2, Fuel, Gauge, Palette, Settings2 } from "lucide-react";
import { WhatsAppGlyphIcon } from "@/components/icons/BrandIcons";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleGallery } from "@/components/VehicleGallery";
import { VehicleFeatures } from "@/components/VehicleFeatures";
import { getAllVehicleSlugs, getSimilarVehicles, getVehicleBySlug } from "@/lib/queries";
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

// Pré-renderiza todas as páginas de veículo no build (carregamento
// instantâneo, servido estático). Veículos cadastrados depois continuam
// funcionando normalmente (renderizados sob demanda na primeira visita).
export async function generateStaticParams() {
  const slugs = await getAllVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Revalidação de segurança a cada hora, além do revalidatePath já
// disparado pelas actions do admin quando um veículo é editado.
export const revalidate = 3600;

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

  const fichaTecnica = [
    { label: "Tipo de carroceria", value: categoryLabel(vehicle.category) },
    { label: "Ano de fabricação", value: String(vehicle.yearFab) },
    { label: "Ano do modelo", value: String(vehicle.yearModel) },
    { label: "Quilometragem", value: formatKm(vehicle.km) },
    { label: "Câmbio", value: transmissionLabel(vehicle.transmission) },
    { label: "Combustível", value: fuelLabel(vehicle.fuel) },
    ...(vehicle.color ? [{ label: "Cor", value: vehicle.color }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="mb-6 flex items-center gap-2 text-xs text-text-onlight-dim">
        <Link href="/" className="hover:text-accent">
          Início
        </Link>
        <span>/</span>
        <Link href="/estoque" className="hover:text-accent">
          Nossos carros
        </Link>
        <span>/</span>
        <span className="font-medium text-text-onlight">{vehicleTitle(vehicle)}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_.9fr]">
        <div className="min-w-0">
          <VehicleGallery photos={photos} title={vehicleTitle(vehicle)} />
        </div>

        <div className="min-w-0 rounded-3xl border border-line-dark bg-ink p-6 text-text-ondark">
          <p className="flex items-center gap-2 font-data text-xs font-semibold uppercase tracking-widest text-accent">
            <span className="h-px w-4 bg-accent" />
            {vehicle.brand} • {vehicle.yearModel}
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            {vehicleTitle(vehicle)}
          </h1>

          <p className="mt-5 font-data text-xs uppercase tracking-widest text-text-ondark-dim">
            Valor
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">
            {formatPrice(vehicle.price)}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {specs.map((s) => (
              <div key={s.label} className="rounded-xl bg-ink-soft p-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <s.icon size={16} />
                </span>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-text-ondark-dim">
                  {s.label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-text-ondark">{s.value}</p>
              </div>
            ))}
          </div>

          <a
            href={whatsappLink(vehicleWhatsappMessage(vehicle))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1fbd5a]"
          >
            <WhatsAppGlyphIcon size={18} />
            Falar com um vendedor
          </a>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5 text-xs text-text-ondark-dim">
              <CheckCircle2 size={14} className="text-[#25D366]" />
              Procedência verificada
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-ondark-dim">
              <CheckCircle2 size={14} className="text-[#25D366]" />
              Documentação completa
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-10">
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-text-onlight">
            Ficha técnica
          </h2>
          <div className="grid grid-cols-1 gap-x-8 rounded-2xl border border-line-light bg-surface p-5 sm:grid-cols-2 sm:p-6">
            {fichaTecnica.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 border-b border-line-light py-3"
              >
                <span className="text-xs text-text-onlight-dim">{item.label}</span>
                <span className="text-sm font-bold text-text-onlight">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <VehicleFeatures features={vehicle.features} />

        {vehicle.description && (
          <div>
            <h2 className="font-display text-lg font-bold text-text-onlight">Descrição</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-onlight-dim">
              {vehicle.description}
            </p>
          </div>
        )}
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-onlight">
            Veículos semelhantes
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} variant="dark" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
