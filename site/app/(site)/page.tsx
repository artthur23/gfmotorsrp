import Image from "next/image";
import { AtSign, Car, Clock, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { WhatsAppGlyphIcon } from "@/components/icons/BrandIcons";
import { Button } from "@/components/Button";
import { VehicleCard } from "@/components/VehicleCard";
import { DifferentialsMarquee } from "@/components/DifferentialsMarquee";
import { Reveal } from "@/components/Reveal";
import {
  getApprovedTestimonials,
  getDifferentials,
  getFeaturedVehicles,
  getSiteContent,
  getTopPricedVehicles,
  getVehicleCount,
} from "@/lib/queries";
import { whatsappLink } from "@/lib/format";

// Estática com revalidação: fica em cache (rápida, sem round-trip ao
// banco a cada visita) e é regenerada na hora quando o admin edita
// veículos/conteúdo (revalidatePath nas actions) ou, no máximo, a cada hora.
export const revalidate = 3600;

const ADDRESS = "Av. Professor João Fiúsa, 945 - B. Alto da Boa Vista, Ribeirão Preto - SP";

export default async function HomePage() {
  const [featured, topPriced, differentials, about, testimonials, vehicleCount] = await Promise.all([
    getFeaturedVehicles(1),
    getTopPricedVehicles(8),
    getDifferentials(),
    getSiteContent("sobre_empresa"),
    getApprovedTestimonials(),
    getVehicleCount(),
  ]);

  return (
    <>
      {/* Hero — cancela o padding-top do <main> pra ficar por trás do
          cabeçalho, que começa transparente nessa página */}
      <section className="relative -mt-(--header-h) flex min-h-screen flex-col overflow-hidden bg-ink text-text-ondark">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 78% 15%, rgba(166,30,43,.22), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl flex-1 items-center gap-10 px-5 py-16 lg:grid-cols-[1.1fr_.9fr]">
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
              <Button href="/estoque">
                <Car size={16} />
                Ver veículos
              </Button>
              <Button
                variant="whatsapp"
                href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppGlyphIcon size={16} />
                WhatsApp
              </Button>
            </div>
          </div>

          {featured[0] && (
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/10 bg-ink-soft shadow-2xl">
              <Image
                src={featured[0].photos[0]?.url ?? "/vehicle-placeholder.svg"}
                alt={`${featured[0].brand} ${featured[0].model}`}
                fill
                quality={90}
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
                priority
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-ink/85 px-4 py-2 font-data text-xs text-text-ondark">
                {featured[0].brand} {featured[0].model} · {featured[0].yearModel}
              </span>
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div className="relative border-t border-white/10 bg-ink-soft">
          <DifferentialsMarquee items={differentials} />
        </div>
      </section>

      {/* Destaques */}
      {topPriced.length > 0 && (
        <section className="flex min-h-screen flex-col justify-center bg-[#24231F] px-5 py-16 text-text-ondark">
          <div className="mx-auto w-full max-w-6xl">
            <Reveal>
              <p className="flex items-center gap-2 font-data text-xs uppercase tracking-widest text-accent">
                <span className="h-px w-4 bg-accent" />
                Estoque atual
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                Destaques do estoque
              </h2>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {topPriced.map((v, i) => (
                <Reveal key={v.slug} delay={Math.min(i, 6) * 60}>
                  <VehicleCard vehicle={v} variant="dark" />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8 flex justify-center">
              <Button href="/estoque">Ver todos os carros ({vehicleCount} veículos)</Button>
            </Reveal>
          </div>
        </section>
      )}

      {/* Diferenciais */}
      {differentials.length > 0 && (
        <section id="diferenciais" className="scroll-mt-20 flex min-h-screen flex-col justify-center bg-[#24231F] text-text-ondark">
          <div className="mx-auto w-full max-w-6xl px-5 py-16">
            <Reveal>
              <p className="font-data text-xs uppercase tracking-widest text-accent">Diferenciais</p>
              <h2 className="mt-1 mb-10 font-display text-2xl font-bold sm:text-3xl">
                Por que comprar na GF Motors?
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {differentials.map((d, i) => (
                <Reveal key={d.titulo} delay={Math.min(i, 6) * 60} className="h-full">
                  <div className="h-full rounded-2xl border border-white/10 bg-ink-soft p-6">
                    <ShieldCheck className="mb-3 text-accent" size={22} />
                    <h3 className="font-display text-base font-bold">{d.titulo}</h3>
                    <p className="mt-1 text-sm text-text-ondark-dim">{d.texto}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fundador */}
      {about && (
        <section id="fundador" className="scroll-mt-20 relative flex min-h-screen flex-col justify-center overflow-hidden bg-ink text-text-ondark">
          <div
            className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--color-tricolor-green)" }}
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full opacity-25 blur-3xl bg-accent"
          />

          <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-end gap-6 px-5 py-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
            <Reveal className="relative mx-auto w-full max-w-70 sm:max-w-80 lg:mx-0 lg:max-w-96">
              <div className="relative aspect-629/1024 w-full">
                <Image
                  src="/team/givago-retrato-cutout.png"
                  alt="Givago Ferrari, fundador da GF Motors"
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 384px, 70vw"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
              <div className="mt-3 flex items-center gap-2 px-1">
                <span className="h-1.5 flex-1 rounded-full" style={{ background: "var(--color-tricolor-green)" }} />
                <span className="h-1.5 flex-1 rounded-full bg-white" />
                <span className="h-1.5 flex-1 rounded-full bg-accent" />
              </div>
            </Reveal>

            <Reveal
              delay={120}
              className="rounded-3xl border border-white/10 bg-ink-soft p-8 text-center sm:p-10 lg:text-left"
            >
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
            </Reveal>
          </div>
        </section>
      )}

      {/* Prova social */}
      {testimonials.length > 0 && (
        <section className="flex min-h-screen flex-col justify-center bg-surface py-16">
          <div className="mx-auto w-full max-w-6xl px-5">
            <Reveal>
              <h2 className="mb-8 font-display text-2xl font-bold text-text-onlight sm:text-3xl">
                O que nossos clientes dizem
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i, 6) * 60} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-line-light bg-ink p-6 text-text-ondark shadow-sm">
                    <div className="mb-2 flex gap-0.5 text-accent">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-text-ondark-dim">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <p className="mt-3 font-display text-sm font-bold text-text-ondark">
                      — {t.authorName}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Localização + Contato */}
      <section id="contato" className="scroll-mt-20 flex min-h-screen flex-col justify-center bg-ink py-16 text-text-ondark">
        <div id="localizacao" className="scroll-mt-20 mx-auto w-full max-w-6xl px-5">
          <Reveal className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:grid-cols-[.85fr_1.15fr]">
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#0b1c12] transition-colors hover:bg-[#1fbd5a]"
                >
                  <WhatsAppGlyphIcon size={17} /> Falar no WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/gfmotorsrp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-text-ondark transition-colors hover:bg-white/10"
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
          </Reveal>
        </div>
      </section>
    </>
  );
}
