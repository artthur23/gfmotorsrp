"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CATEGORY_OPTIONS, FUEL_OPTIONS, STATUS_OPTIONS, TRANSMISSION_OPTIONS } from "@/lib/options";
import { deleteVehiclePhoto } from "@/lib/vehicle-actions";

const INPUT =
  "w-full border border-line-light bg-paper px-3 py-2 text-sm text-text-onlight";

type VehicleFormData = {
  id: string;
  brand: string;
  model: string;
  version: string | null;
  yearFab: number;
  yearModel: number;
  km: number;
  price: number;
  fuel: string;
  transmission: string;
  color: string | null;
  category: string;
  description: string | null;
  status: string;
  featured: boolean;
  photos: { id: string; url: string }[];
} | null;

export function VehicleForm({
  vehicle,
  action,
}: {
  vehicle: VehicleFormData;
  action: (formData: FormData) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handlePhotoDelete(photoId: string) {
    startTransition(async () => {
      await deleteVehiclePhoto(photoId);
      router.refresh();
    });
  }

  return (
    <form action={action} className="space-y-8" encType="multipart/form-data">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Marca">
          <input name="brand" required defaultValue={vehicle?.brand} className={INPUT} />
        </Field>
        <Field label="Modelo">
          <input name="model" required defaultValue={vehicle?.model} className={INPUT} />
        </Field>
        <Field label="Versão" className="sm:col-span-2">
          <input name="version" defaultValue={vehicle?.version ?? ""} className={INPUT} />
        </Field>
        <Field label="Ano de fabricação">
          <input
            type="number"
            name="yearFab"
            required
            defaultValue={vehicle?.yearFab}
            className={INPUT}
          />
        </Field>
        <Field label="Ano do modelo">
          <input
            type="number"
            name="yearModel"
            required
            defaultValue={vehicle?.yearModel}
            className={INPUT}
          />
        </Field>
        <Field label="Quilometragem">
          <input type="number" name="km" required defaultValue={vehicle?.km} className={INPUT} />
        </Field>
        <Field label="Preço (R$)">
          <input
            type="number"
            name="price"
            required
            defaultValue={vehicle?.price}
            className={INPUT}
          />
        </Field>
        <Field label="Combustível">
          <select name="fuel" defaultValue={vehicle?.fuel ?? "FLEX"} className={INPUT}>
            {FUEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Câmbio">
          <select
            name="transmission"
            defaultValue={vehicle?.transmission ?? "MANUAL"}
            className={INPUT}
          >
            {TRANSMISSION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Categoria">
          <select name="category" defaultValue={vehicle?.category ?? "SEDAN"} className={INPUT}>
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cor">
          <input name="color" defaultValue={vehicle?.color ?? ""} className={INPUT} />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={vehicle?.status ?? "DISPONIVEL"} className={INPUT}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-text-onlight">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={vehicle?.featured}
            className="size-4"
          />
          Destacar na home
        </label>
      </div>

      <Field label="Descrição">
        <textarea
          name="description"
          rows={4}
          defaultValue={vehicle?.description ?? ""}
          className={INPUT}
        />
      </Field>

      {vehicle && vehicle.photos.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-text-onlight-dim">
            Fotos atuais
          </p>
          <div className="flex flex-wrap gap-3">
            {vehicle.photos.map((p) => (
              <div key={p.id} className="relative">
                <div className="relative size-24 overflow-hidden border border-line-light bg-ink">
                  <Image src={p.url} alt="" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handlePhotoDelete(p.id)}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center bg-accent text-white disabled:opacity-50"
                  aria-label="Remover foto"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Field label="Adicionar fotos">
        <input type="file" name="photos" accept="image/*" multiple className={INPUT} />
      </Field>

      <button
        type="submit"
        className="bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-strong"
      >
        {vehicle ? "Salvar alterações" : "Cadastrar veículo"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-xs uppercase tracking-wide text-text-onlight-dim ${className}`}>
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}
