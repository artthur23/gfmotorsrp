import {
  Check,
  CreditCard,
  MessageCircle,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import type { Differential } from "@/lib/queries";

// Ícones deliberadamente simples (traços únicos, sem formas
// compostas tipo o selo do BadgeCheck) — o "selo" já é o próprio
// quadrado com borda vermelha, o ícone não precisa repetir isso.
const ICONS: LucideIcon[] = [Check, CreditCard, MessageCircle, Globe2];

// Repeated enough times so a single track's natural width comfortably
// exceeds any realistic viewport, even with just 1-2 differentials.
const REPEAT = 8;

function Track({ items }: { items: Differential[] }) {
  const repeated = Array.from({ length: REPEAT }, () => items).flat();

  return (
    <div className="flex shrink-0 items-center gap-12 px-6" aria-hidden>
      {repeated.map((d, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <div key={`${d.titulo}-${i}`} className="flex shrink-0 items-center gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent bg-accent/30 text-accent"
              style={{ boxShadow: "0 0 10px 1.5px rgba(236,24,47,.6)" }}
            >
              <Icon size={17} strokeWidth={1.75} />
            </span>
            <span className="whitespace-nowrap font-display text-base font-bold text-text-ondark">
              {d.titulo}
            </span>
            <span className="ml-2.5 text-base text-accent">•</span>
          </div>
        );
      })}
    </div>
  );
}

export function DifferentialsMarquee({ items }: { items: Differential[] }) {
  if (items.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden py-7"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee items-center">
        <Track items={items} />
        <Track items={items} />
      </div>
    </div>
  );
}
