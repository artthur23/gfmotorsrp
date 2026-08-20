"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { deleteTestimonial, toggleTestimonialApproval } from "@/lib/content-actions";

type Testimonial = {
  id: string;
  authorName: string;
  text: string;
  rating: number;
  approved: boolean;
};

export function TestimonialRow({ testimonial }: { testimonial: Testimonial }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <li className="flex items-start justify-between gap-4 border-b border-line-light px-5 py-4 last:border-b-0">
      <div>
        <div className="mb-1 flex gap-0.5 text-accent">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
        </div>
        <p className="text-sm text-text-onlight">{testimonial.text}</p>
        <p className="mt-1 text-xs text-text-onlight-dim">— {testimonial.authorName}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-text-onlight-dim">
          <input
            type="checkbox"
            disabled={isPending}
            defaultChecked={testimonial.approved}
            onChange={(e) => {
              startTransition(async () => {
                await toggleTestimonialApproval(testimonial.id, e.target.checked);
                router.refresh();
              });
            }}
          />
          Publicado
        </label>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Excluir esse depoimento?")) return;
            startTransition(async () => {
              await deleteTestimonial(testimonial.id);
              router.refresh();
            });
          }}
          className="text-text-onlight-dim hover:text-accent disabled:opacity-50"
          aria-label="Excluir depoimento"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}
