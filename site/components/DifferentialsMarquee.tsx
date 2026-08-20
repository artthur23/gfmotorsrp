import {
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import type { Differential } from "@/lib/queries";

const ICONS: LucideIcon[] = [ShieldCheck, CreditCard, MessageCircle, Globe2];

function Track({ items }: { items: Differential[] }) {
  return (
    <div className="flex min-w-screen shrink-0 items-center justify-around gap-8 px-4" aria-hidden>
      {items.map((d, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <div key={d.titulo} className="flex shrink-0 items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent bg-ink text-accent"
              style={{ boxShadow: "0 0 14px 1px rgba(166,30,43,.55)" }}
            >
              <Icon size={19} />
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
