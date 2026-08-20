"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { whatsappLink } from "@/lib/format";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/estoque", label: "Estoque" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#fundador", label: "Fundador" },
  { href: "/#localizacao", label: "Localização" },
  { href: "/#contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="GF Motors" width={40} height={48} priority />
          <span className="font-display text-lg font-extrabold tracking-wide text-text-ondark">
            GF MOTORS
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium uppercase tracking-wider transition-colors ${
                  active ? "text-accent" : "text-text-ondark-dim hover:text-text-ondark"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 font-data text-xs font-medium tracking-wide text-white transition-colors hover:bg-accent-strong lg:flex"
        >
          WhatsApp
        </a>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-text-ondark lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line-dark bg-ink px-5 pb-5 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium uppercase tracking-wide text-text-ondark-dim hover:text-text-ondark"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center rounded-full bg-accent px-4 py-3 font-data text-xs font-medium tracking-wide text-white"
            >
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
