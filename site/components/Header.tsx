"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { whatsappLink } from "@/lib/format";
import { WhatsAppGlyphIcon } from "@/components/icons/BrandIcons";
import { VehicleSearchModal } from "@/components/VehicleSearchModal";
import type { SearchableVehicle } from "@/lib/queries";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/estoque", label: "Nossos carros" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#fundador", label: "Fundador" },
  { href: "/#contato", label: "Contato" },
];

export function Header({
  searchVehicles,
  searchBrands,
}: {
  searchVehicles: SearchableVehicle[];
  searchBrands: string[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Só a home tem hero em tela cheia logo abaixo do cabeçalho — nas
  // outras páginas ele fica sempre sólido (o fundo delas é claro).
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-ink"
      }`}
    >
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

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar veículos"
            className="flex size-9 items-center justify-center rounded-full border border-white/15 text-text-ondark-dim transition-colors hover:border-white/30 hover:text-text-ondark"
          >
            <Search size={17} />
          </button>
          <a
            href={whatsappLink("Olá! Vim pelo site da GF Motors e gostaria de mais informações.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-data text-xs font-medium tracking-wide text-white transition-colors hover:bg-[#1fbd5a]"
          >
            <WhatsAppGlyphIcon size={15} />
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar veículos"
            className="text-text-ondark"
          >
            <Search size={22} />
          </button>

          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
            className="text-text-ondark"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-data text-xs font-medium tracking-wide text-white"
            >
              <WhatsAppGlyphIcon size={15} />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}

      <VehicleSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        vehicles={searchVehicles}
        brands={searchBrands}
      />
    </header>
  );
}
