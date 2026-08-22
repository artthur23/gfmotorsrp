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
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
