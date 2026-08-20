export function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatKm(km: number) {
  return `${km.toLocaleString("pt-BR")} km`;
}

export function vehicleTitle(v: { brand: string; model: string; version?: string | null }) {
  return [v.brand, v.model, v.version].filter(Boolean).join(" ");
}

export function whatsappLink(message: string, phone?: string) {
  const number = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${number}?${params.toString()}`;
}

export function vehicleWhatsappMessage(v: {
  brand: string;
  model: string;
  version?: string | null;
  yearModel: number;
}) {
  return `Olá! Tenho interesse no ${vehicleTitle(v)} ${v.yearModel} que vi no site da GF Motors.`;
}

const FUEL_LABELS: Record<string, string> = {
  FLEX: "Flex",
  GASOLINA: "Gasolina",
  DIESEL: "Diesel",
  HIBRIDO: "Híbrido",
  ELETRICO: "Elétrico",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATICO: "Automático",
  AUTOMATIZADO: "Automatizado",
};

const CATEGORY_LABELS: Record<string, string> = {
  HATCH: "Hatch",
  SEDAN: "Sedã",
  SUV: "SUV",
  PICAPE: "Picape",
  UTILITARIO: "Utilitário",
  CONVERSIVEL: "Conversível",
  ESPORTIVO: "Esportivo",
};

const STATUS_LABELS: Record<string, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
};

export function fuelLabel(v: string) {
  return FUEL_LABELS[v] ?? v;
}
export function transmissionLabel(v: string) {
  return TRANSMISSION_LABELS[v] ?? v;
}
export function categoryLabel(v: string) {
  return CATEGORY_LABELS[v] ?? v;
}
export function statusLabel(v: string) {
  return STATUS_LABELS[v] ?? v;
}
