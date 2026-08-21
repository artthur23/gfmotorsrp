import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { whatsappLink } from "@/lib/format";

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-ink text-text-ondark-dim">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-14 sm:flex-row sm:flex-wrap sm:justify-between lg:flex-nowrap">
        <div className="sm:max-w-56">
          <div className="mb-4 flex items-center gap-3">
            <Image src="/logo.png" alt="GF Motors" width={36} height={44} />
            <span className="font-display text-base font-extrabold tracking-wide text-text-ondark">
              GF MOTORS
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Seminovos e usados, nacionais e importados, em Ribeirão Preto - SP desde 2013.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-1 w-8 rounded-full" style={{ background: "var(--color-tricolor-green)" }} />
            <span className="h-1 w-8 rounded-full bg-white" />
            <span className="h-1 w-8 rounded-full bg-accent" />
          </div>
        </div>

        <div className="shrink-0">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-text-ondark">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-accent">Início</Link></li>
            <li><Link href="/estoque" className="hover:text-accent">Nossos carros</Link></li>
            <li><Link href="/#diferenciais" className="hover:text-accent">Diferenciais</Link></li>
            <li><Link href="/#fundador" className="hover:text-accent">Fundador</Link></li>
            <li><Link href="/#contato" className="hover:text-accent">Contato</Link></li>
          </ul>
        </div>

        <div className="sm:max-w-72">
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
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span>
                Segunda a sexta: 8h às 18h
                <br />
                Sábado: 8h às 13h
              </span>
            </li>
          </ul>

          <div className="mt-4 flex gap-2.5">
            <a
              href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-lg bg-white transition-transform hover:scale-105"
            >
              <WhatsAppIcon size={18} />
            </a>
            <a
              href="https://www.instagram.com/gfmotorsrp/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-lg bg-white transition-transform hover:scale-105"
            >
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line-dark px-5 py-5 text-center text-xs text-text-ondark-dim/70">
        © {new Date().getFullYear()} GF Motors. Todos os direitos reservados.
      </div>
    </footer>
  );
}
