import { LeadForm } from "@/components/LeadForm";
import { whatsappLink } from "@/lib/format";

export const metadata = { title: "Contato" };

export default function ContatoPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16">
      <p className="font-data text-xs uppercase tracking-widest text-accent">Contato</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-text-onlight sm:text-4xl">
        Fale com a gente
      </h1>
      <p className="mt-4 text-base text-text-onlight-dim">
        Prefere WhatsApp?{" "}
        <a
          href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          Fale direto com a gente
        </a>
        . Ou deixe seus dados abaixo.
      </p>

      <div className="mt-8">
        <LeadForm />
      </div>
    </section>
  );
}
