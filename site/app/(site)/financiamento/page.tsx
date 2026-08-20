import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";
import { whatsappLink } from "@/lib/format";

export const metadata = { title: "Financiamento" };

const POINTS = [
  "Taxas negociadas direto com os principais bancos",
  "Aprovação rápida, sem burocracia",
  "Condições sob medida pro seu perfil",
  "Simulação sem compromisso",
];

export default function FinanciamentoPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="font-data text-xs uppercase tracking-widest text-accent">Financiamento</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-text-onlight sm:text-4xl">
        Realize o sonho do seu carro novo.
      </h1>
      <p className="mt-4 max-w-xl text-base text-text-onlight-dim">
        Cuidamos de toda a parte de financiamento pra você sair de carro no mesmo dia. Fale
        com a gente e simule sem compromisso.
      </p>

      <ul className="mt-8 space-y-3">
        {POINTS.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-text-onlight">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
            {p}
          </li>
        ))}
      </ul>

      <Button
        href={whatsappLink("Olá! Gostaria de simular um financiamento com a GF Motors.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8"
      >
        Simular financiamento
      </Button>
    </section>
  );
}
