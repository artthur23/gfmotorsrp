import {
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import type { Differential } from "@/lib/queries";

const ICONS: LucideIcon[] = [ShieldCheck, CreditCard, MessageCircle, Globe2];

export function DifferentialsMarquee({ items }: { items: Differential[] }) {
  if (items.length === 0) return null;

  const track = [...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden py-5"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee items-center gap-8">
        {track.map((d, i) => {
          const Icon = ICONS[i % items.length % ICONS.length];
          return (
            <div key={`${d.titulo}-${i}`} className="flex shrink-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Icon size={17} />
              </span>
              <span className="whitespace-nowrap font-display text-sm font-bold text-text-ondark">
                {d.titulo}
              </span>
              <span className="text-accent">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
