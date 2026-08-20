import { VehicleForm } from "../VehicleForm";
import { createVehicle } from "@/lib/vehicle-actions";

export const metadata = { title: "Novo veículo" };

export default function NovoVeiculoPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text-onlight">Novo veículo</h1>
      <VehicleForm vehicle={null} action={createVehicle} />
    </div>
  );
}
