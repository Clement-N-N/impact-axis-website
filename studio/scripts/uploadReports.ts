/**
 * Uploads the published report PDFs and creates their documents.
 *
 * Run from the studio directory:
 *   npx sanity exec scripts/uploadReports.ts --with-user-token
 *
 * Deliberately additive only. It creates new documents with server-generated
 * ids and never calls createOrReplace, patch or delete, so it cannot overwrite
 * or remove anything an editor has published. Running it twice would create
 * duplicates rather than clobber the originals, so it refuses to run if reports
 * already exist.
 */
import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-09" });

const DOWNLOADS = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
);

type Seed = {
  file: string;
  title: { en: string; fr: string };
  category: "annual" | "midYear" | "programme" | "financial";
  publishedAt: string;
  periodLabel: { en: string; fr: string };
  summary: { en: string; fr: string };
  featured?: boolean;
};

const SEEDS: Seed[] = [
  {
    file: "Goodwill Fellowship Report 2021.pdf",
    title: {
      en: "Goodwill Fellowship Report 2021",
      fr: "Rapport du Goodwill Fellowship 2021",
    },
    category: "programme",
    publishedAt: "2021-12-31",
    periodLabel: { en: "2021", fr: "2021" },
    summary: {
      en: "A review of the 2021 Goodwill Fellowship covering the fellowship experience, impact stories, finances and the way forward. Published under Youths Inspiration, it records 130 young people reached, 15 fellows, 10 volunteers and more than 17 workshop sessions.",
      fr: "Un bilan du Goodwill Fellowship 2021 : l'expérience du programme, des récits d'impact, les finances et les perspectives. Publié sous Youths Inspiration, il recense 130 jeunes touchés, 15 fellows, 10 bénévoles et plus de 17 ateliers.",
    },
  },
  {
    file: "2024 Impact Axis Annual Report.pdf",
    title: { en: "2024 Annual Report", fr: "Rapport annuel 2024" },
    category: "annual",
    publishedAt: "2024-12-31",
    periodLabel: { en: "2024", fr: "2024" },
    summary: {
      en: "Our year of return. Covers the executive summary, our year in numbers, key achievements, impact stories, a financial overview, and the challenges and lessons shaping what comes next.",
      fr: "Notre année du retour. Comprend le résumé exécutif, l'année en chiffres, les réalisations clés, des récits d'impact, un aperçu financier ainsi que les défis et les enseignements qui orientent la suite.",
    },
  },
  {
    file: "Our 2025 Annual Report.pdf",
    title: { en: "2025 Annual Report", fr: "Rapport annuel 2025" },
    category: "annual",
    publishedAt: "2025-12-31",
    periodLabel: { en: "2025", fr: "2025" },
    summary: {
      en: "A word from our founder on how Impact Axis began, the organisation's journey of evolution, the 2025 Fellowship, the year's financials and acknowledgements.",
      fr: "Un mot de notre fondateur sur les débuts d'Impact Axis, le parcours d'évolution de l'organisation, le Fellowship 2025, les finances de l'année et les remerciements.",
    },
    featured: true,
  },
];

async function main() {
  const existing = await client.fetch(
    `*[_type == "report"]{_id, "title": title.en}`,
  );
  console.log(`Existing report documents: ${existing.length}`);
  for (const doc of existing) console.log(`   - ${doc.title} (${doc._id})`);

  if (existing.length > 0) {
    console.log(
      "\nReports already exist. Refusing to run so nothing is duplicated.",
    );
    return;
  }

  for (const seed of SEEDS) {
    const filePath = path.join(DOWNLOADS, seed.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`SKIP — not found: ${filePath}`);
      continue;
    }

    const bytes = fs.statSync(filePath).size;
    console.log(
      `\nUploading ${seed.file} (${(bytes / 1048576).toFixed(1)} MB)...`,
    );

    const asset = await client.assets.upload(
      "file",
      fs.createReadStream(filePath),
      { filename: seed.file, contentType: "application/pdf" },
    );
    console.log(`   asset ${asset._id}`);

    const doc = await client.create({
      _type: "report",
      title: { _type: "localizedString", ...seed.title },
      category: seed.category,
      publishedAt: seed.publishedAt,
      periodLabel: { _type: "localizedString", ...seed.periodLabel },
      summary: { _type: "localizedText", ...seed.summary },
      featured: seed.featured ?? false,
      file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    });
    console.log(`   document ${doc._id} — ${seed.title.en}`);
  }

  console.log("\nDone. Nothing was overwritten or deleted.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
