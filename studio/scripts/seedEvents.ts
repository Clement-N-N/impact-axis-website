import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-09" });

const IMAGES_DIR = path.resolve(__dirname, "../../public/images");

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function uploadImage(filename: string) {
  const filePath = path.join(IMAGES_DIR, filename);
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), { filename });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

function paragraph(en: string, fr: string) {
  const block = (text: string) => ({
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
  });
  return { en: [block(en)], fr: [block(fr)] };
}

async function main() {
  console.log("Uploading images...");
  const [heroYouth, heroMentorship, heroSummit, imgAicha, imgBrice, imgSandrine, imgGrace, logoMelton, logoOpenSociety] =
    await Promise.all([
      uploadImage("team-1.jpg"),
      uploadImage("girls-2.jpg"),
      uploadImage("collage-image-1.png"),
      uploadImage("alumni-1.jpg"),
      uploadImage("alumni-2.png"),
      uploadImage("alumni-3.png"),
      uploadImage("alumni-4.png"),
      uploadImage("placeholder_image_1.png"),
      uploadImage("placeholder_image_2.png"),
    ]);

  console.log("Creating partners...");
  const meltonFoundation = await client.create({
    _type: "eventPartner",
    name: "Melton Foundation",
    logo: logoMelton,
  });
  const openSociety = await client.create({
    _type: "eventPartner",
    name: "Open Society",
    logo: logoOpenSociety,
  });

  console.log("Creating people...");
  const aicha = await client.create({ _type: "eventPerson", name: "Aïcha Ndongo", image: imgAicha });
  const brice = await client.create({ _type: "eventPerson", name: "Brice Fotso", image: imgBrice });
  const sandrine = await client.create({ _type: "eventPerson", name: "Sandrine Eyenga", image: imgSandrine });
  const clarisse = await client.create({ _type: "eventPerson", name: "Clarisse Etoundi" });
  const grace = await client.create({ _type: "eventPerson", name: "Honorable Grace Ashu", image: imgGrace });

  const personRole = (person: { _id: string }, en: string, fr: string) => ({
    _type: "eventPersonRole",
    _key: randomKey(),
    person: { _type: "reference", _ref: person._id },
    title: { en, fr },
  });

  const partnerRef = (partner: { _id: string }) => ({
    _type: "reference",
    _key: randomKey(),
    _ref: partner._id,
  });

  console.log("Creating events...");

  await client.create({
    _type: "event",
    title: { en: "Youth Career Fair", fr: "Salon de l'emploi jeunesse" },
    slug: { _type: "slug", current: "youth-career-fair" },
    location: { en: "Yaoundé, Cameroon", fr: "Yaoundé, Cameroun" },
    date: "2026-03-14",
    heroImage: heroYouth,
    registerHref: "https://www.impactaxis.org/events/youth-career-fair/register",
    speakers: [
      personRole(aicha, "Head of Talent, Impact Axis", "Responsable Talent, Impact Axis"),
      personRole(brice, "Career Coach", "Coach de carrière"),
    ],
    partners: [partnerRef(meltonFoundation), partnerRef(openSociety)],
    programOverview: paragraph(
      "This event brings together young people, mentors and employers for a day of practical workshops, panel discussions and networking focused on building durable, work-ready skills.",
      "Cet événement réunit des jeunes, des mentors et des employeurs pour une journée d'ateliers pratiques, de tables rondes et de réseautage axée sur le développement de compétences durables et prêtes à l'emploi.",
    ),
    specialGuests: [
      personRole(sandrine, "Director, Ministry of Youth Affairs", "Directrice, Ministère de la Jeunesse"),
    ],
  });

  await client.create({
    _type: "event",
    title: { en: "Mentorship Kickoff", fr: "Lancement du mentorat" },
    slug: { _type: "slug", current: "mentorship-kickoff" },
    location: { en: "Bamenda, Cameroon", fr: "Bamenda, Cameroun" },
    date: "2026-10-05",
    heroImage: heroMentorship,
    registerHref: "https://www.impactaxis.org/events/mentorship-kickoff/register",
    speakers: [personRole(clarisse, "Alumni Mentor", "Mentore, ancienne du programme")],
    partners: [partnerRef(meltonFoundation)],
    programOverview: paragraph(
      "Sessions run throughout the day, with breaks for informal networking and one-on-one conversations with speakers, partners and fellow attendees.",
      "Les sessions se déroulent tout au long de la journée, entrecoupées de pauses réseautage informelles et d'échanges individuels avec les intervenants, partenaires et autres participants.",
    ),
    specialGuests: [personRole(brice, "Guest Lecturer", "Conférencier invité")],
  });

  await client.create({
    _type: "event",
    title: { en: "Annual Impact Summit", fr: "Sommet annuel de l'impact" },
    slug: { _type: "slug", current: "annual-impact-summit" },
    location: { en: "Yaoundé, Cameroon", fr: "Yaoundé, Cameroun" },
    date: "2027-01-16",
    heroImage: heroSummit,
    registerHref: "https://www.impactaxis.org/events/annual-impact-summit/register",
    speakers: [
      personRole(aicha, "Executive Director", "Directrice exécutive"),
      personRole(sandrine, "Head of Impact Measurement", "Responsable de la mesure d'impact"),
    ],
    partners: [partnerRef(openSociety)],
    programOverview: paragraph(
      "Join us as we reflect on a year of impact, share results from our flagship programs, and set the agenda for what comes next.",
      "Rejoignez-nous pour revenir sur une année d'impact, partager les résultats de nos programmes phares et définir les priorités à venir.",
    ),
    specialGuests: [personRole(grace, "Member of Parliament", "Membre du Parlement")],
  });

  console.log("Done. Created 3 events, 5 people, 2 partners.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
