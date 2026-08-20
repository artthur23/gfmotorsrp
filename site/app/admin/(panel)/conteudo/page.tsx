import { prisma } from "@/lib/db";
import { getDifferentials, getSiteContent } from "@/lib/queries";
import {
  createTestimonial,
  updateDiferenciais,
  updateSobreEmpresa,
} from "@/lib/content-actions";
import { TestimonialRow } from "./TestimonialRow";

export const metadata = { title: "Conteúdo" };

const INPUT =
  "w-full border border-line-light bg-paper px-3 py-2 text-sm text-text-onlight";
const MAX_DIFFERENTIALS = 6;

export default async function ConteudoPage() {
  const [about, differentials, testimonials] = await Promise.all([
    getSiteContent("sobre_empresa"),
    getDifferentials(),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const rows = Array.from({ length: MAX_DIFFERENTIALS }).map(
    (_, i) => differentials[i] ?? { titulo: "", texto: "" },
  );

  return (
    <div className="space-y-10">
      <h1 className="font-display text-2xl font-bold text-text-onlight">Conteúdo do site</h1>

      <section className="border border-line-light bg-surface p-6">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
          Sobre a empresa
        </h2>
        <p className="mb-3 text-xs text-text-onlight-dim">
          Esse texto aparece na seção &quot;Fundador&quot; da home (/#fundador).
        </p>
        <form action={updateSobreEmpresa} className="space-y-3">
          <textarea
            name="sobre_empresa"
            rows={6}
            defaultValue={about ?? ""}
            className={INPUT}
          />
          <button
            type="submit"
            className="bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="border border-line-light bg-surface p-6">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
          Diferenciais
        </h2>
        <form action={updateDiferenciais} className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2fr]">
              <input
                name={`titulo_${i}`}
                defaultValue={row.titulo}
                placeholder={`Título ${i + 1} (deixe vazio pra remover)`}
                className={INPUT}
              />
              <input
                name={`texto_${i}`}
                defaultValue={row.texto}
                placeholder="Descrição"
                className={INPUT}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
          >
            Salvar diferenciais
          </button>
        </form>
      </section>

      <section className="border border-line-light bg-surface p-6">
        <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-text-onlight">
          Depoimentos
        </h2>

        {testimonials.length > 0 && (
          <ul className="mb-6 border border-line-light">
            {testimonials.map((t) => (
              <TestimonialRow key={t.id} testimonial={t} />
            ))}
          </ul>
        )}

        <form action={createTestimonial} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="authorName" required placeholder="Nome do cliente" className={INPUT} />
          <select name="rating" defaultValue="5" className={INPUT}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} estrelas
              </option>
            ))}
          </select>
          <textarea
            name="text"
            required
            rows={3}
            placeholder="Texto do depoimento"
            className={`${INPUT} sm:col-span-2`}
          />
          <button
            type="submit"
            className="bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent-strong sm:col-span-2"
          >
            Adicionar depoimento
          </button>
        </form>
      </section>
    </div>
  );
}
