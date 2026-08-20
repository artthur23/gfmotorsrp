"use client";

import { useState } from "react";

const LIMIT = 9;

export function VehicleFeatures({ features }: { features: string[] }) {
  const [expanded, setExpanded] = useState(false);
  if (features.length === 0) return null;

  const visible = expanded ? features : features.slice(0, LIMIT);

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-text-onlight">
        Equipamentos e opcionais
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {visible.map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-2 rounded-full border border-line-light bg-surface px-4 py-2 text-sm text-text-onlight"
          >
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: "#2f6b4f" }} />
            {f}
          </span>
        ))}
      </div>
      {features.length > LIMIT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 rounded-full border border-line-light px-4 py-2 text-xs font-semibold text-text-onlight-dim transition-colors hover:text-text-onlight"
        >
          {expanded ? "Ver menos" : `Ver todos os ${features.length} equipamentos`}
        </button>
      )}
    </div>
  );
}
