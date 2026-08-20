import Image from "next/image";

type ShieldBadgeProps = {
  label: string;
  value: string;
  size?: "sm" | "md";
};

export function ShieldBadge({ label, value, size = "md" }: ShieldBadgeProps) {
  const dimension = size === "sm" ? 34 : 44;

  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt=""
        width={dimension}
        height={dimension * 1.19}
        className="shrink-0"
      />
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-wide text-text-ondark">
          {value}
        </p>
        <p className="text-xs text-text-ondark-dim">{label}</p>
      </div>
    </div>
  );
}
