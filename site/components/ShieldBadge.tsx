type ShieldBadgeProps = {
  label: string;
  value: string;
  size?: "sm" | "md";
};

export function ShieldBadge({ label, value, size = "md" }: ShieldBadgeProps) {
  const dimension = size === "sm" ? "size-12" : "size-16";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative ${dimension} shrink-0 bg-gradient-to-br from-ink-soft via-[#2c2f33] to-ink-soft`}
        style={{
          clipPath:
            "polygon(50% 0%, 100% 18%, 100% 62%, 50% 100%, 0% 62%, 0% 18%)",
        }}
      >
        <span
          className="absolute inset-x-0 top-0 h-[14%]"
          style={{
            background: "linear-gradient(90deg, #2f6b4f, #f2f1ee 50%, #a61e2b)",
            clipPath: "polygon(50% 0%, 100% 100%, 50% 68%, 0% 100%)",
            opacity: 0.9,
          }}
        />
      </div>
      <div>
        <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">
          {value}
        </p>
        <p className="text-xs text-text-onlight-dim">{label}</p>
      </div>
    </div>
  );
}
