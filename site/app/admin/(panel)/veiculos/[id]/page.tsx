import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateVehicle } from "@/lib/vehicle-actions";
import { VehicleForm } from "../VehicleForm";

export const metadata = { title: "Editar veículo" };

export default async function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!vehicle) notFound();

  const boundUpdate = updateVehicle.bind(null, vehicle.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text-onlight">
        Editar veículo
      </h1>
      <VehicleForm vehicle={vehicle} action={boundUpdate} />
    </div>
  );
}
