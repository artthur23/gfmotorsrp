import Image from "next/image";
import Link from "next/link";
import { Gauge, Fuel, Settings2 } from "lucide-react";
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

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const cover = vehicle.photos[0]?.url ?? "/vehicle-placeholder.svg";
  const sold = vehicle.status === "VENDIDO";
  const reserved = vehicle.status === "RESERVADO";

  return (
    <Link
      href={`/estoque/${vehicle.slug}`}
      className="group block overflow-hidden border border-line-light bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink">
        <Image
          src={cover}
          alt={vehicleTitle(vehicle)}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-ink/85 px-2 py-1 font-data text-[11px] text-text-ondark">
          {vehicle.yearFab}/{vehicle.yearModel}
        </span>
        {(sold || reserved) && (
          <span className="absolute right-3 top-3 bg-accent px-2 py-1 font-data text-[11px] uppercase tracking-wide text-white">
            {sold ? "Vendido" : "Reservado"}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-bold leading-tight text-text-onlight">
          {vehicleTitle(vehicle)}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-onlight-dim">
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

        <p className="mt-3 font-display text-xl font-extrabold text-accent">
          {formatPrice(vehicle.price)}
        </p>
      </div>
    </Link>
  );
}
