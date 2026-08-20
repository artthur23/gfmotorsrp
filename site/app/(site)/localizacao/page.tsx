import { Clock, MapPin, Phone } from "lucide-react";

export const metadata = { title: "Localização" };

const ADDRESS = "Av. Professor João Fiúsa, 945 - B. Alto da Boa Vista, Ribeirão Preto - SP";

export default function LocalizacaoPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="font-data text-xs uppercase tracking-widest text-accent">Localização</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-text-onlight sm:text-4xl">
        Venha nos visitar
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-display text-base font-bold text-text-onlight">Endereço</p>
              <p className="text-sm text-text-onlight-dim">
                {ADDRESS}
                <br />
                CEP 14025-310
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={20} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-display text-base font-bold text-text-onlight">Telefone</p>
              <p className="text-sm text-text-onlight-dim">(16) 99765-0050</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={20} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <p className="font-display text-base font-bold text-text-onlight">Horário</p>
              <p className="text-sm text-text-onlight-dim">
                Segunda a sexta: 8h às 18h
                <br />
                Sábado: 8h às 13h
              </p>
            </div>
          </div>
        </div>

        <div className="aspect-4/3 overflow-hidden border border-line-light lg:aspect-auto">
          <iframe
            title="Localização da GF Motors"
            src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            className="h-full min-h-[320px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
