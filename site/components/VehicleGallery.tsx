"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

type Photo = { id: string; url: string };

const MAIN_SIZES = "(min-width: 1024px) 660px, 100vw";
// 75/90 são as únicas qualidades liberadas em next.config.ts (images.qualities).
const MAIN_QUALITY = 75;
const LIGHTBOX_SIZES = "90vw";
const LIGHTBOX_QUALITY = 90;

export function VehicleGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = photos.length;
  const current = photos[index] ?? photos[0];

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, goPrev, goNext]);

  if (!current) return null;

  // Anterior/próxima pré-carregadas no tamanho do viewer atual, pra trocar de
  // foto (setas, miniaturas) ficar instantâneo em vez de esperar o fetch.
  const neighborIndexes =
    count > 1 ? Array.from(new Set([(index - 1 + count) % count, (index + 1) % count])) : [];

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-ink">
        <Image
          key={current.id}
          src={current.url}
          alt={title}
          fill
          quality={MAIN_QUALITY}
          sizes={MAIN_SIZES}
          className="object-cover"
          priority
        />

        {neighborIndexes.map((i) => (
          <Image
            key={`preload-${photos[i].id}`}
            src={photos[i].url}
            alt=""
            fill
            quality={MAIN_QUALITY}
            sizes={MAIN_SIZES}
            className="hidden"
            priority
            aria-hidden
          />
        ))}

        {/* Pré-carrega a foto atual no tamanho do lightbox, em segundo plano,
            pra abrir em tela cheia não esperar o fetch dessa variante maior. */}
        <Image
          key={`preload-lightbox-${current.id}`}
          src={current.url}
          alt=""
          fill
          quality={LIGHTBOX_QUALITY}
          sizes={LIGHTBOX_SIZES}
          className="hidden"
          priority
          fetchPriority="low"
          aria-hidden
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink/90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink/90"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 font-data text-xs text-white">
              {index + 1} / {count}
            </span>
          </>
        )}

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Ver em tela cheia"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink/90"
        >
          <Expand size={17} />
        </button>
      </div>

      {count > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg bg-ink transition-opacity ${
                i === index ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={p.url} alt="" fill quality={75} sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Foto anterior"
            className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>

          <div
            className="relative h-full max-h-[85vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current.id}
              src={current.url}
              alt={title}
              fill
              quality={LIGHTBOX_QUALITY}
              sizes={LIGHTBOX_SIZES}
              className="object-contain"
              priority
            />

            {neighborIndexes.map((i) => (
              <Image
                key={`preload-lightbox-${photos[i].id}`}
                src={photos[i].url}
                alt=""
                fill
                quality={LIGHTBOX_QUALITY}
                sizes={LIGHTBOX_SIZES}
                className="hidden"
                priority
                aria-hidden
              />
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Próxima foto"
            className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-data text-xs text-white">
            {index + 1} / {count}
          </span>
        </div>
      )}
    </div>
  );
}
