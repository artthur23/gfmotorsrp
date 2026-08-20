import Image from "next/image";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/Button";
import { VehicleCard } from "@/components/VehicleCard";
import { ShieldBadge } from "@/components/ShieldBadge";
import {
  getApprovedTestimonials,
  getDifferentials,
  getFeaturedVehicles,
  getSiteContent,
} from "@/lib/queries";
import { whatsappLink } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, differentials, about, testimonials] = await Promise.all([
    getFeaturedVehicles(),
    getDifferentials(),
    getSiteContent("sobre_empresa"),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-text-ondark">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 78% 15%, rgba(166,30,43,.22), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-28">
          <div>
            <p className="font-data text-xs uppercase tracking-[0.2em] text-accent">
              Seminovos &amp; importados · Ribeirão Preto
            </p>
            <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[0.98] sm:text-5xl lg:text-6xl">
              Seu próximo carro
              <br />
              <span className="text-accent">com procedência garantida.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm text-text-ondark-dim sm:text-base">
              Nacionais e importados revisados, financiamento facilitado e atendimento
              direto do início ao pós-venda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/estoque">Ver estoque</Button>
              <Button
                variant="ghost"
                href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </Button>
            </div>
          </div>

          {featured[0] && (
            <div className="relative aspect-4/3 overflow-hidden border border-white/10 bg-ink-soft">
              <Image
                src={featured[0].photos[0]?.url ?? "/vehicle-placeholder.svg"}
                alt={`${featured[0].brand} ${featured[0].model}`}
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
                priority
              />
              <span className="absolute bottom-3 left-3 bg-ink/85 px-3 py-1.5 font-data text-xs text-text-ondark">
                {featured[0].brand} {featured[0].model} · {featured[0].yearModel}
              </span>
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div className="relative grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 bg-ink-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-5">
            <ShieldBadge label="Procedência" value="100% verificada" size="sm" />
          </div>
          <div className="px-6 py-5">
            <ShieldBadge label="Garantia" value="Estendida" size="sm" />
          </div>
          <div className="px-6 py-5">
            <ShieldBadge label="Atendimento" value="Direto no WhatsApp" size="sm" />
          </div>
        </div>
      </section>

      {/* Destaques */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-data text-xs uppercase tracking-widest text-accent">Destaques</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-text-onlight sm:text-3xl">
                Os mais desejados
              </h2>
            </div>
            <Button variant="outline" href="/estoque" className="hidden sm:inline-flex">
              Ver todos
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} />
            ))}
          </div>
        </section>
      )}

      {/* Diferenciais */}
      {differentials.length > 0 && (
        <section className="bg-ink text-text-ondark">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="mb-10 font-display text-2xl font-bold sm:text-3xl">
              Por que comprar na GF Motors?
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {differentials.map((d) => (
                <div key={d.titulo}>
                  <ShieldCheck className="mb-3 text-accent" size={22} />
                  <h3 className="font-display text-base font-bold">{d.titulo}</h3>
                  <p className="mt-1 text-sm text-text-ondark-dim">{d.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sobre */}
      {about && (
        <section className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="font-data text-xs uppercase tracking-widest text-accent">
            Sobre a GF Motors
          </p>
          <p className="mt-4 text-pretty text-base leading-relaxed text-text-onlight-dim">
            {about}
          </p>
          <Button variant="outline" href="/empresa" className="mt-6">
            Conheça nossa história
          </Button>
        </section>
      )}

      {/* Prova social */}
      {testimonials.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-8 font-display text-2xl font-bold text-text-onlight sm:text-3xl">
              O que nossos clientes dizem
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="border border-line-light p-5">
                  <div className="mb-2 flex gap-0.5 text-accent">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-text-onlight-dim">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="mt-3 font-display text-sm font-bold text-text-onlight">
                    — {t.authorName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Localização */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col items-start justify-between gap-6 border border-line-light bg-surface p-8 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 shrink-0 text-accent" size={22} />
            <div>
              <h2 className="font-display text-lg font-bold text-text-onlight">
                Venha nos visitar
              </h2>
              <p className="text-sm text-text-onlight-dim">
                Av. Professor João Fiúsa, 945 — B. Alto da Boa Vista, Ribeirão Preto - SP
              </p>
            </div>
          </div>
          <Button href="/localizacao" variant="outline">
            Como chegar
          </Button>
        </div>
      </section>
    </>
  );
}
