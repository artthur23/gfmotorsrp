import { ShieldCheck } from "lucide-react";
import { getDifferentials, getSiteContent } from "@/lib/queries";

export const metadata = { title: "Empresa" };
export const dynamic = "force-dynamic";

export default async function EmpresaPage() {
  const [about, differentials] = await Promise.all([
    getSiteContent("sobre_empresa"),
    getDifferentials(),
  ]);

  return (
    <div>
      <section className="bg-ink text-text-ondark">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="font-data text-xs uppercase tracking-widest text-accent">
            Desde 2013 em Ribeirão Preto
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            A GF Motors
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-pretty text-base leading-relaxed text-text-onlight-dim">
          {about}
        </p>
      </section>

      {differentials.length > 0 && (
        <section className="bg-surface py-14">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-text-onlight">
              Nossos diferenciais
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {differentials.map((d) => (
                <div key={d.titulo} className="text-center">
                  <ShieldCheck className="mx-auto mb-3 text-accent" size={24} />
                  <h3 className="font-display text-base font-bold text-text-onlight">
                    {d.titulo}
                  </h3>
                  <p className="mt-1 text-sm text-text-onlight-dim">{d.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
