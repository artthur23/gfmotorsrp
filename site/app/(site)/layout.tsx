import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSearchableVehicles, getTopBrands } from "@/lib/queries";

// Mesma cadência de revalidação das páginas: evita bater no banco a
// cada requisição só pra montar o dataset de busca do cabeçalho.
export const revalidate = 3600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [searchVehicles, searchBrands] = await Promise.all([
    getSearchableVehicles(),
    getTopBrands(),
  ]);

  return (
    <>
      <Header searchVehicles={searchVehicles} searchBrands={searchBrands} />
      {/* Compensa o Header virar `fixed` (fica fora do fluxo). A home
          cancela isso com -mt-[var(--header-h)] no hero, pra ele ficar
          por trás do cabeçalho transparente no topo da página. */}
      <main className="flex-1 pt-(--header-h)">{children}</main>
      <Footer />
    </>
  );
}
