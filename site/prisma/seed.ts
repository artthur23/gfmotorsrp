import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { slugify } from "../lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const VEHICLES = [
  {
    brand: "Land Rover",
    model: "Discovery Sport",
    version: "2.0 16V TD4 Turbo Diesel SE 4P Automático",
    yearFab: 2022,
    yearModel: 2023,
    km: 34500,
    price: 259900,
    fuel: "DIESEL",
    transmission: "AUTOMATICO",
    color: "Preto",
    category: "SUV",
    description:
      "Discovery Sport revisada, com histórico completo de manutenção e procedência verificada. Interior em couro, teto panorâmico e pacote completo de assistência ao motorista.",
    featured: true,
  },
  {
    brand: "Nissan",
    model: "Frontier",
    version: "2.5 SE 4x4 CD Turbo Eletronic Diesel 4P Manual",
    yearFab: 2021,
    yearModel: 2022,
    km: 58200,
    price: 189900,
    fuel: "DIESEL",
    transmission: "MANUAL",
    color: "Prata",
    category: "PICAPE",
    description:
      "Picape robusta com tração 4x4, pneus novos e revisões em dia. Ideal para trabalho e estrada.",
    featured: true,
  },
  {
    brand: "BMW",
    model: "X1",
    version: "sDrive20i GP",
    yearFab: 2021,
    yearModel: 2021,
    km: 41000,
    price: 179900,
    fuel: "GASOLINA",
    transmission: "AUTOMATICO",
    color: "Branco",
    category: "SUV",
    description: "Importada, único dono, todas as revisões na concessionária.",
    featured: true,
  },
  {
    brand: "Toyota",
    model: "Corolla",
    version: "2.0 XEI Flex Automático",
    yearFab: 2020,
    yearModel: 2020,
    km: 62000,
    price: 109900,
    fuel: "FLEX",
    transmission: "AUTOMATICO",
    color: "Prata",
    category: "SEDAN",
    description: "Sedã econômico e confiável, ótimo custo-benefício.",
    featured: false,
  },
  {
    brand: "Jeep",
    model: "Compass",
    version: "Longitude 1.3 Turbo 4P Automático",
    yearFab: 2023,
    yearModel: 2023,
    km: 22000,
    price: 139900,
    fuel: "FLEX",
    transmission: "AUTOMATICO",
    color: "Cinza",
    category: "SUV",
    description: "Seminova, praticamente zero km, garantia de fábrica vigente.",
    featured: true,
  },
  {
    brand: "Honda",
    model: "Civic",
    version: "2.0 EXL Flex Automático",
    yearFab: 2019,
    yearModel: 2020,
    km: 71000,
    price: 99900,
    fuel: "FLEX",
    transmission: "AUTOMATICO",
    color: "Preto",
    category: "SEDAN",
    description: "Bem conservado, revisões em concessionária, pneus novos.",
    featured: false,
  },
] as const;

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@gfmotorsrp.com.br";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "TrocarSenha123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Givago Ferrari",
    },
  });

  for (const v of VEHICLES) {
    const slug = slugify(`${v.brand}-${v.model}-${v.version}-${v.yearModel}`);
    await prisma.vehicle.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        brand: v.brand,
        model: v.model,
        version: v.version,
        yearFab: v.yearFab,
        yearModel: v.yearModel,
        km: v.km,
        price: v.price,
        fuel: v.fuel as never,
        transmission: v.transmission as never,
        color: v.color,
        category: v.category as never,
        description: v.description,
        featured: v.featured,
        photos: {
          create: [{ url: "/vehicle-placeholder.svg", order: 0 }],
        },
      },
    });
  }

  await prisma.siteContent.upsert({
    where: { key: "sobre_empresa" },
    update: {},
    create: {
      key: "sobre_empresa",
      value:
        "A GF Motors atua em Ribeirão Preto desde 2013, com foco na compra, venda e troca de veículos seminovos e usados, nacionais e importados. Cada veículo passa por avaliação de procedência antes de entrar no estoque, e o atendimento é conduzido diretamente pelo proprietário, Givago Ferrari, do primeiro contato até a entrega das chaves.",
    },
  });

  await prisma.siteContent.upsert({
    where: { key: "diferenciais" },
    update: {},
    create: {
      key: "diferenciais",
      value: JSON.stringify([
        { titulo: "Procedência verificada", texto: "Todo veículo é checado antes de entrar no estoque." },
        { titulo: "Financiamento facilitado", texto: "Condições e taxas negociadas direto com os principais bancos." },
        { titulo: "Atendimento direto", texto: "Do primeiro contato ao pós-venda, sempre com a mesma pessoa." },
        { titulo: "Nacionais e importados", texto: "Estoque variado, de sedãs de entrada a SUVs premium." },
      ]),
    },
  });

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          authorName: "Depoimento de exemplo — substituir",
          rating: 5,
          text: "Texto placeholder até você colar uma avaliação real do Google. Vá em /admin/conteudo para trocar.",
          approved: false,
        },
      ],
    });
  }

  console.log("Seed concluído.");
  console.log(`Login admin: ${adminEmail} / senha: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
