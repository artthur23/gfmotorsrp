"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteVehicle } from "@/lib/vehicle-actions";

export function DeleteVehicleButton({
  vehicleId,
  vehicleTitle,
}: {
  vehicleId: string;
  vehicleTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Excluir "${vehicleTitle}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      await deleteVehicle(vehicleId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleDelete}
      className="text-xs font-medium text-text-onlight-dim hover:text-accent disabled:opacity-50"
    >
      Excluir
    </button>
  );
}
