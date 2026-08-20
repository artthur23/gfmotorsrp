import {
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import type { Differential } from "@/lib/queries";

const ICONS: LucideIcon[] = [ShieldCheck, CreditCard, MessageCircle, Globe2];

// Repeated enough times so a single track's natural width comfortably
// exceeds any realistic viewport, even with just 1-2 differentials.
const REPEAT = 8;

function Track({ items }: { items: Differential[] }) {
  const repeated = Array.from({ length: REPEAT }, () => items).flat();

  return (
    <div className="flex shrink-0 items-center gap-10 px-5" aria-hidden>
      {repeated.map((d, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <div key={`${d.titulo}-${i}`} className="flex shrink-0 items-center gap-2.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-accent bg-accent/25 text-accent"
              style={{ boxShadow: "0 0 12px 1px rgba(166,30,43,.6)" }}
            >
              <Icon size={18} />
            </span>
            <span className="whitespace-nowrap font-display text-base font-bold text-text-ondark">
              {d.titulo}
            </span>
            <span className="text-base text-accent">•</span>
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
      className="relative w-full overflow-hidden py-6"
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
