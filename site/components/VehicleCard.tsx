import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Gauge, Fuel, Settings2 } from "lucide-react";
import {
  formatKm,
  formatPrice,
  fuelLabel,
  transmissionLabel,
  vehicleTitle,
} from "@/lib/format";

type VehicleCardData = {
  slug: string;
  brand: string;
  model: string;
  version: string | null;
  yearFab: number;
  yearModel: number;
  km: number;
  price: number;
  fuel: string;
  transmission: string;
  status: string;
  photos: { url: string }[];
};

export function VehicleCard({
  vehicle,
  variant = "light",
}: {
  vehicle: VehicleCardData;
  variant?: "light" | "dark";
}) {
  const cover = vehicle.photos[0]?.url ?? "/vehicle-placeholder.svg";
  const sold = vehicle.status === "VENDIDO";
  const reserved = vehicle.status === "RESERVADO";
  const dark = variant === "dark";

  return (
    <Link
      href={`/estoque/${vehicle.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-xl ${
        dark ? "border-white/10 bg-ink-soft" : "border-line-light bg-surface"
      }`}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink">
        <Image
          src={cover}
          alt={vehicleTitle(vehicle)}
          fill
          quality={90}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 47vw, 94vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 font-data text-[11px] text-text-ondark">
          {vehicle.yearFab}/{vehicle.yearModel}
        </span>
        {(sold || reserved) && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 font-data text-[11px] uppercase tracking-wide text-white">
            {sold ? "Vendido" : "Reservado"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className={`line-clamp-2 min-h-11 font-display text-lg font-bold leading-tight ${
            dark ? "text-text-ondark" : "text-text-onlight"
          }`}
        >
          {vehicleTitle(vehicle)}
        </h3>

        <div
          className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs ${
            dark ? "text-text-ondark-dim" : "text-text-onlight-dim"
          }`}
        >
          <span className="flex items-center gap-1">
            <Gauge size={13} /> {formatKm(vehicle.km)}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 size={13} /> {transmissionLabel(vehicle.transmission)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel size={13} /> {fuelLabel(vehicle.fuel)}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <p
            className={`font-display text-xl font-extrabold ${
              dark ? "text-text-ondark" : "text-accent"
            }`}
          >
            {formatPrice(vehicle.price)}
          </p>
          <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-accent">
            Ver detalhes
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
