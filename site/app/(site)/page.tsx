import Image from "next/image";
import { AtSign, Clock, MapPin, MessageCircle, Phone, ShieldCheck, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";
import { VehicleCard } from "@/components/VehicleCard";
import { ShieldBadge } from "@/components/ShieldBadge";
import {
  getApprovedTestimonials,
  getDifferentials,
  getFeaturedVehicles,
  getSiteContent,
  getVehicleCount,
} from "@/lib/queries";
import { whatsappLink } from "@/lib/format";

export const dynamic = "force-dynamic";

const ADDRESS = "Av. Professor João Fiúsa, 945 - B. Alto da Boa Vista, Ribeirão Preto - SP";

const FINANCING_POINTS = [
  "Taxas negociadas direto com os principais bancos",
  "Aprovação rápida, sem burocracia",
  "Condições sob medida pro seu perfil",
];

export default async function HomePage() {
  const [featured, differentials, about, testimonials, vehicleCount] = await Promise.all([
    getFeaturedVehicles(),
    getDifferentials(),
    getSiteContent("sobre_empresa"),
    getApprovedTestimonials(),
    getVehicleCount(),
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
                quality={90}
                sizes="(min-width: 1024px) 500px, 90vw"
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
        {differentials.length > 0 && (
          <div className="relative border-t border-white/10 bg-ink-soft">
            <div className="mx-auto flex max-w-6xl flex-wrap divide-y divide-white/10 sm:flex-nowrap sm:divide-y-0 sm:divide-x">
              {differentials.map((d) => (
                <div key={d.titulo} className="w-full px-6 py-5 sm:w-auto sm:flex-1">
                  <ShieldBadge label={d.texto} value={d.titulo} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
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
              Ver todos ({vehicleCount})
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} />
            ))}
          </div>
          <Button variant="outline" href="/estoque" className="mt-6 flex sm:hidden">
            Ver todos ({vehicleCount})
          </Button>
        </section>
      )}

      {/* Diferenciais */}
      {differentials.length > 0 && (
        <section id="diferenciais" className="scroll-mt-20 bg-ink text-text-ondark">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="font-data text-xs uppercase tracking-widest text-accent">Diferenciais</p>
            <h2 className="mt-1 mb-10 font-display text-2xl font-bold sm:text-3xl">
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

      {/* Financiamento */}
      <section id="financiamento" className="scroll-mt-20 bg-surface py-16">
        <div className="mx-auto max-w-4xl px-5">
          <p className="font-data text-xs uppercase tracking-widest text-accent">Financiamento</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-text-onlight sm:text-3xl">
            Realize o sonho do seu carro novo.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-text-onlight-dim">
            Cuidamos de toda a parte de financiamento pra você sair de carro no mesmo dia.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {FINANCING_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-text-onlight">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>
          <Button
            href={whatsappLink("Olá! Gostaria de simular um financiamento com a GF Motors.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6"
          >
            Simular financiamento
          </Button>
        </div>
      </section>

      {/* Fundador */}
      {about && (
        <section id="fundador" className="scroll-mt-20 relative overflow-hidden bg-ink text-text-ondark">
          <div
            className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "#2f6b4f" }}
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "#a61e2b" }}
          />

          <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-end gap-6 px-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
            <div className="mx-auto w-full max-w-sm lg:mx-0">
              <div className="relative h-105 w-full sm:h-125 lg:h-150">
                <Image
                  src="/team/givago-retrato-cutout.png"
                  alt="Givago Ferrari, fundador da GF Motors"
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 420px, 80vw"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
              <div className="mt-3 flex gap-2">
                <span className="h-1 flex-1 rounded-full" style={{ background: "#2f6b4f" }} />
                <span className="h-1 flex-1 rounded-full bg-accent" />
              </div>
            </div>

            <div className="pb-16 pt-10 text-center lg:pb-20 lg:pt-16 lg:text-left">
              <p className="flex items-center justify-center gap-2 font-data text-xs uppercase tracking-widest text-accent lg:justify-start">
                <span className="h-px w-4 bg-accent" />
                O fundador
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                Givago Ferrari
              </h2>

              <blockquote className="mx-auto mt-6 max-w-md border-l-2 border-accent pl-5 text-left lg:mx-0">
                <p className="text-pretty text-base leading-relaxed text-text-ondark-dim">
                  {about}
                </p>
              </blockquote>

              <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
                <Image
                  src="/logo.png"
                  alt=""
                  width={32}
                  height={38}
                  className="shrink-0"
                />
                <div className="text-left">
                  <p className="font-display text-sm font-bold text-text-ondark">
                    Givago Ferrari
                  </p>
                  <p className="text-xs text-text-ondark-dim">Fundador da GF Motors</p>
                </div>
              </div>
            </div>
          </div>
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

      {/* Localização + Contato */}
      <section id="contato" className="scroll-mt-20 bg-ink py-16 text-text-ondark">
        <div id="localizacao" className="scroll-mt-20 mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 border border-white/10 lg:grid-cols-[.85fr_1.15fr]">
            <div className="bg-ink-soft p-8 lg:p-12">
              <p className="flex items-center gap-2 font-data text-xs uppercase tracking-widest text-accent">
                <span className="h-px w-4 bg-accent" />
                Vamos conversar
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.05] sm:text-4xl">
                Vamos achar o <span className="text-accent">seu carro</span>?
              </h2>
              <p className="mt-4 text-sm text-text-ondark-dim">
                Chama no WhatsApp e fala com o time. A gente te mostra o estoque atualizado,
                avalia seu usado e tira todas as suas dúvidas na hora.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0b1c12] transition-colors hover:bg-[#1fbd5a]"
                >
                  <MessageCircle size={17} /> Falar no WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/gfmotorsrp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-sm font-semibold text-text-ondark transition-colors hover:bg-white/10"
                >
                  <AtSign size={17} /> Instagram
                </a>
              </div>

              <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-ondark-dim">
                      Endereço
                    </p>
                    <p className="text-sm font-medium text-text-ondark">
                      {ADDRESS}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-ondark-dim">
                      Telefone / WhatsApp
                    </p>
                    <p className="text-sm font-medium text-text-ondark">(16) 99765-0050</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-ondark-dim">
                      Horário
                    </p>
                    <p className="text-sm font-medium text-text-ondark">
                      Segunda a Sexta, 8h às 18h
                      <br />
                      Sábado, 8h às 13h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-80 lg:min-h-0">
              <iframe
                title="Localização da GF Motors"
                src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
