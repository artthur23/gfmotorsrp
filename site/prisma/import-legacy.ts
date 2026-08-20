import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getStore } from "@netlify/blobs";
import { slugify } from "../lib/slug";

const NETLIFY_TOKEN = process.env.NETLIFY_TOKEN;
const NETLIFY_SITE_ID = process.env.NETLIFY_SITE_ID;
if (!NETLIFY_TOKEN || !NETLIFY_SITE_ID) {
  throw new Error("NETLIFY_TOKEN e NETLIFY_SITE_ID precisam estar setados no ambiente");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const store = getStore({
  name: "vehicle-photos",
  siteID: NETLIFY_SITE_ID,
  token: NETLIFY_TOKEN,
});

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&atilde;/g, "ã")
    .replace(/&otilde;/g, "õ")
    .replace(/&ccedil;/g, "ç")
    .replace(/&ecirc;/g, "ê")
    .replace(/&acirc;/g, "â")
    .replace(/&ocirc;/g, "ô")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function field(html: string, label: string): string | null {
  const re = new RegExp(
    `${label}\\s*:?\\s*</span></td>\\s*<td[^>]*>\\s*<span[^>]*>([^<]*)</span>`,
    "i",
  );
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

const CATEGORY_RULES: [RegExp, string][] = [
  [/utilitario esportivo|\bsuv\b/, "SUV"],
  [/picape|pick-?up/, "PICAPE"],
  [/hatch/, "HATCH"],
  [/^sed/, "SEDAN"],
  [/conversivel|cabriolet|conversible/, "CONVERSIVEL"],
  [/cupe|coupe|esportivo/, "ESPORTIVO"],
  [/perua|sw\b|minivan|furgao/, "SUV"],
  [/utilitario/, "UTILITARIO"],
];

function mapCategory(raw: string | null, warnings: string[], id: string): string {
  if (!raw) {
    warnings.push(`${id}: sem "Tipo de veículo", usando SEDAN`);
    return "SEDAN";
  }
  const key = stripAccents(raw.toLowerCase()).trim();
  for (const [re, value] of CATEGORY_RULES) {
    if (re.test(key)) return value;
  }
  warnings.push(`${id}: categoria desconhecida "${raw}", usando SEDAN`);
  return "SEDAN";
}

const FUEL_MAP: Record<string, string> = {
  flex: "FLEX",
  gasolina: "GASOLINA",
  diesel: "DIESEL",
  hibrido: "HIBRIDO",
  "hibrido/gasolina": "HIBRIDO",
  eletrico: "ELETRICO",
  alcool: "FLEX",
};

function mapFuel(raw: string | null, warnings: string[], id: string): string {
  if (!raw) return "FLEX";
  const key = stripAccents(raw.toLowerCase()).trim();
  if (FUEL_MAP[key]) return FUEL_MAP[key];
  warnings.push(`${id}: combustível desconhecido "${raw}", usando FLEX`);
  return "FLEX";
}

function mapTransmission(title: string): string {
  const t = stripAccents(title.toLowerCase());
  if (/\bmanual\b/.test(t)) return "MANUAL";
  if (/automatizad|amt\b/.test(t)) return "AUTOMATIZADO";
  return "AUTOMATICO";
}

function extractPhotos(html: string): string[] {
  const re = /data-lightview-group='\d+' href=(https:\/\/www\.garaje\.com\.br\/imagens\/anuncios\/[^\s>]+\.webp)/g;
  const urls: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    urls.push(m[1]);
  }
  return urls;
}

function extractDescription(html: string): string {
  const m = html.match(
    /Observa[çc][õo]es<\/span>[\s\S]*?<span class='texto12_preto_normal' >([\s\S]*?)<\/span><\/td>/,
  );
  if (!m) return "";
  let text = m[1]
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((l) => decodeEntities(l).trim())
    .filter(Boolean)
    .join("\n");

  const cutMarkers = ["Confira minhas redes sociais", "Insta:", "Favor agendar"];
  for (const marker of cutMarkers) {
    const idx = text.indexOf(marker);
    if (idx >= 0) text = text.slice(0, idx).trim();
  }
  return text;
}

function extractOptions(html: string): string[] {
  const block = html.match(/Opcionais<\/span>([\s\S]*?)Observa[çc][õo]es<\/span>/);
  if (!block) return [];
  const spans = [...block[1].matchAll(/texto12_preto_normal' >([^<]+)<\/span>/g)];
  return spans.map((s) => decodeEntities(s[1])).filter((s) => s && s !== "");
}

type Parsed = {
  legacyId: string;
  brand: string;
  model: string;
  fullTitle: string;
  category: string;
  yearFab: number;
  yearModel: number;
  fuel: string;
  transmission: string;
  color: string | null;
  km: number;
  price: number;
  description: string;
  options: string[];
  photoUrls: string[];
};

function parseDetailPage(html: string, urlPath: string, warnings: string[]): Parsed | null {
  const idMatch = urlPath.match(/\/exibicao\/(\d+)\//);
  const legacyId = idMatch ? idMatch[1] : "?";

  const nameMatch = html.match(/f_dados_completos' value='([^']*)'/);
  if (!nameMatch) {
    warnings.push(`${legacyId}: sem f_dados_completos, pulando`);
    return null;
  }
  const fullName = decodeEntities(nameMatch[1]);
  const [brandRaw, ...rest] = fullName.split(" - ");
  const brand = brandRaw
    .trim()
    .toLowerCase()
    .replace(/(^|\s|-)\w/g, (c) => c.toUpperCase());
  const modelFull = rest.join(" - ").trim();

  const anoModelo = field(html, "Ano/Modelo");
  const [yearFabStr, yearModelStr] = (anoModelo ?? "0/0").split("/");
  const yearFab = parseInt(yearFabStr, 10) || 0;
  const yearModel = parseInt(yearModelStr, 10) || yearFab;

  const kmStr = field(html, "KM");
  const km = kmStr ? parseInt(kmStr.replace(/\D/g, ""), 10) || 0 : 0;

  const priceMatch = html.match(/texto16_preto_negrito' >R\$ ([\d.,]+)<\/span>/);
  const price = priceMatch
    ? Math.round(parseFloat(priceMatch[1].replace(/\./g, "").replace(",", ".")))
    : 0;

  const color = field(html, "Cor");
  const categoryRaw = field(html, "Tipo de veículo");
  const fuelRaw = field(html, "Combustível");

  return {
    legacyId,
    brand,
    model: modelFull.split(" ").slice(0, 2).join(" "),
    fullTitle: modelFull,
    category: mapCategory(categoryRaw, warnings, legacyId),
    yearFab,
    yearModel,
    fuel: mapFuel(fuelRaw, warnings, legacyId),
    transmission: mapTransmission(modelFull),
    color,
    km,
    price,
    description: extractDescription(html),
    options: extractOptions(html),
    photoUrls: extractPhotos(html),
  };
}

async function uploadPhoto(url: string, legacyId: string, index: number): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const key = `legacy-${legacyId}-${index}.webp`;
    await store.set(key, buffer, { metadata: { contentType: "image/webp" } });
    return `/blob-uploads/${key}`;
  } catch {
    return null;
  }
}

async function processVehicle(urlPath: string, warnings: string[]) {
  const legacyId = urlPath.match(/\/exibicao\/(\d+)\//)?.[1] ?? "?";
  const res = await fetch(`https://www.gfmotorsrp.com.br${urlPath}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) {
    warnings.push(`${legacyId}: HTTP ${res.status} ao buscar detalhe`);
    return;
  }
  const html = await res.text();
  const parsed = parseDetailPage(html, urlPath, warnings);
  if (!parsed) return;

  const descriptionParts = [parsed.description];
  if (parsed.options.length > 0) {
    descriptionParts.push("\nItens: " + parsed.options.join(", "));
  }
  const description = descriptionParts.filter(Boolean).join("\n").trim();

  const slug = slugify(`${parsed.brand}-${parsed.fullTitle}-${parsed.yearModel}-${parsed.legacyId}`);

  const vehicle = await prisma.vehicle.create({
    data: {
      slug,
      brand: parsed.brand,
      model: parsed.fullTitle,
      yearFab: parsed.yearFab || parsed.yearModel || 2015,
      yearModel: parsed.yearModel || parsed.yearFab || 2015,
      km: parsed.km,
      price: parsed.price,
      fuel: parsed.fuel as never,
      transmission: parsed.transmission as never,
      color: parsed.color,
      category: parsed.category as never,
      description: description || null,
      status: "DISPONIVEL",
    },
  });

  let order = 0;
  const CONCURRENCY = 6;
  for (let i = 0; i < parsed.photoUrls.length; i += CONCURRENCY) {
    const batch = parsed.photoUrls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((u, j) => uploadPhoto(u, parsed.legacyId, i + j)),
    );
    for (const url of results) {
      if (url) {
        await prisma.vehiclePhoto.create({
          data: { vehicleId: vehicle.id, url, order: order++ },
        });
      }
    }
  }

  console.log(
    `[ok] ${parsed.legacyId} ${parsed.brand} ${parsed.model} — ${order} fotos, R$ ${parsed.price}`,
  );
}

async function main() {
  const listPath = path.join(__dirname, "legacy-vehicle-urls.txt");
  let urls = readFileSync(listPath, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean);

  const limit = process.env.IMPORT_LIMIT ? parseInt(process.env.IMPORT_LIMIT, 10) : undefined;
  if (limit) urls = urls.slice(0, limit);

  console.log(`Importando ${urls.length} veículos...`);

  if (!process.env.IMPORT_KEEP_EXISTING) {
    const deleted = await prisma.vehicle.deleteMany({});
    console.log(`Removidos ${deleted.count} veículos de exemplo.`);
  }

  const warnings: string[] = [];
  const CONCURRENCY = 4;
  let done = 0;

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (u) => {
        try {
          await processVehicle(u, warnings);
        } catch (e) {
          warnings.push(`${u}: erro — ${(e as Error).message}`);
        }
        done++;
        if (done % 10 === 0) console.log(`--- progresso: ${done}/${urls.length} ---`);
      }),
    );
  }

  console.log(`\nConcluído: ${done}/${urls.length} veículos processados.`);
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} avisos:`);
    for (const w of warnings) console.log(" -", w);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
