import Image from "next/image";
import Link from "next/link";
import { AtSign, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink text-text-ondark-dim">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src="/logo.png" alt="GF Motors" width={36} height={44} />
            <span className="font-display text-base font-extrabold tracking-wide text-text-ondark">
              GF MOTORS
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Seminovos e usados, nacionais e importados, em Ribeirão Preto - SP desde 2013.
          </p>
          <a
            href="https://www.instagram.com/gfmotorsrp/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-text-ondark-dim hover:text-accent"
          >
            <AtSign size={16} /> @gfmotorsrp
          </a>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-text-ondark">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/estoque" className="hover:text-accent">Estoque</Link></li>
            <li><Link href="/#diferenciais" className="hover:text-accent">Diferenciais</Link></li>
            <li><Link href="/#fundador" className="hover:text-accent">Fundador</Link></li>
            <li><Link href="/#contato" className="hover:text-accent">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-text-ondark">
            Contato
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0" />
              <span>(16) 99765-0050</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>
                Av. Professor João Fiúsa, 945
                <br />
                B. Alto da Boa Vista, Ribeirão Preto - SP
                <br />
                CEP 14025-310
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-text-ondark">
            Horário
          </h3>
          <ul className="space-y-2 text-sm">
            <li>Segunda a sexta: 8h às 18h</li>
            <li>Sábado: 8h às 13h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-dark px-5 py-5 text-center text-xs text-text-ondark-dim/70">
        © {new Date().getFullYear()} GF Motors. Todos os direitos reservados.
      </div>
    </footer>
  );
}
