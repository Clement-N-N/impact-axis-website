import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-09" });

const IMAGES_DIR = path.resolve(__dirname, "../../public/images");

function randomKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

async function uploadLocalImage(filename: string) {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Local image not found: ${filePath}`);
    return undefined;
  }
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), { filename });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

function sanityUrlToAsset(url: string) {
  const match = url.match(/\/([a-f0-9]+-[0-9]+x[0-9]+)\.([a-z0-9]+)$/i);
  if (match) {
    const assetId = `image-${match[1]}-${match[2]}`;
    return {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: assetId,
      },
    };
  }
  return undefined;
}

async function seedTeamAndPartners() {
  console.log("Seeding team members and partner logos...");

  // Team members and partner logos hold uploaded image assets that the
  // About page still references by CDN URL. The About page copy itself now
  // lives in components/sections/about/data.ts, so there is no aboutPage
  // singleton to seed.
  // 1. Team Members
  const coreMembers = [
    {
      id: "clement-ngosong",
      name: "Clement Ngosong",
      role: { en: "Founder", fr: "Fondateur" },
      initials: "CN",
      bio: { en: "[Bio blank]", fr: "[Biographie à compléter]" },
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/eedef936ee8d9bb53a0068caa04b7ed9ae751590-1202x1800.jpg",
      order: 1,
    },
    {
      id: "sosthen-fotso",
      name: "Sosthen Fotso",
      role: { en: "Programme Lead", fr: "Responsable des programmes" },
      initials: "SF",
      bio: { en: "[Bio blank]", fr: "[Biographie à compléter]" },
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/774e34dfdf20966afce2b2b7e5d7a38d628ba271-960x960.jpg",
      order: 2,
    },
    {
      id: "lenora-kelen",
      name: "Lenora Kelen",
      role: { en: "Administrative Lead", fr: "Responsable administrative" },
      initials: "LK",
      bio: { en: "[Bio blank]", fr: "[Biographie à compléter]" },
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/a02874ec90764927a1f8ded1b08202a01657324e-359x404.webp",
      order: 3,
    },
    {
      id: "walters-kumo",
      name: "Walters Kumo",
      role: { en: "Community Lead", fr: "Responsable de la communauté" },
      initials: "WK",
      bio: { en: "[Bio blank]", fr: "[Biographie à compléter]" },
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/f2682869eba4114b07e205ebd7b2c493fd306502-359x404.webp",
      order: 4,
    },
  ];

  for (const m of coreMembers) {
    await client.createOrReplace({
      _id: `teamMember-${m.id}`,
      _type: "teamMember",
      name: m.name,
      role: m.role,
      group: "coreTeam",
      initials: m.initials,
      bio: m.bio,
      image: sanityUrlToAsset(m.imageUrl),
      order: m.order,
    });
  }

  const advisoryMembers = [
    {
      id: "isaac-cudjoe",
      name: "Isaac Cudjoe, PhD",
      initials: "IC",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/a16df3406b554e5f68ccb30e5ae0d09958b4a0a9-1600x2000.jpg",
      bio: {
        en: "Isaac Cudjoe is CEO of Peace First, a global nonprofit supporting young people to lead change in their communities. His career spans youth leadership, systems change, programme design and global strategy across Africa and the United States. He holds a PhD in Public Policy and Administration and brings deep experience building youth-centred programmes, partnerships and institutions.",
        fr: "Isaac Cudjoe est Directeur général de Peace First, une organisation mondiale à but non lucratif qui accompagne les jeunes dans leur capacité à conduire le changement au sein de leurs communautés. Son parcours couvre le leadership des jeunes, la transformation des systèmes, la conception de programmes et la stratégie internationale en Afrique et aux États-Unis. Titulaire d’un doctorat en politiques publiques et administration, il possède une solide expérience dans la conception de programmes, de partenariats et d’institutions centrés sur les jeunes.",
      },
      order: 1,
    },
    {
      id: "nsah-mala",
      name: "Nsah Mala, PhD",
      initials: "NM",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/0189eede73507751f320c0f380fa176442fc92e5-1200x1200.jpg",
      bio: {
        en: "Nsah Mala is an award-winning futurist, foresight practitioner, writer and transdisciplinary researcher working across sustainability, anticipatory governance, environmental humanities and futures studies. His work has included collaborations with organisations such as UNESCO-MOST BRIDGES Coalition, the School of International Futures, Brookings Institution, Future Earth and several European universities.",
        fr: "Nsah Mala est futurologue, spécialiste de la prospective, écrivain et chercheur transdisciplinaire primé. Ses travaux portent notamment sur la durabilité, la gouvernance anticipative, les humanités environnementales et les études des futurs. Il a notamment collaboré avec des organisations telles que la coalition UNESCO-MOST BRIDGES, la School of International Futures, la Brookings Institution, Future Earth ainsi qu’avec plusieurs universités européennes.",
      },
      order: 2,
    },
    {
      id: "clare-ignatowski",
      name: "Clare Ignatowski, PhD",
      initials: "CI",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/cddcb86d220e027318d7620d94e11d661197185e-481x510.jpg",
      bio: {
        en: "Clare Ignatowski is a youth development expert with more than a decade of experience at USAID, where she co-authored the Agency's first Youth in Development Policy and helped design the $500 million YouthPower Project. A former Peace Corps Volunteer and researcher in Cameroon, she brings extensive expertise in youth systems change, soft skills development and large-scale programme design.",
        fr: "Clare Ignatowski est une experte du développement de la jeunesse qui possède plus de dix ans d’expérience à l’USAID, où elle a participé à la rédaction de la première politique de l’Agence consacrée à la jeunesse et au développement et contribué à la conception du projet YouthPower, doté de 500 millions de dollars. Ancienne volontaire du Peace Corps et chercheuse au Cameroun, elle possède une vaste expertise en transformation des systèmes liés à la jeunesse, développement des compétences comportementales et conception de programmes à grande échelle.",
      },
      order: 3,
    },
    {
      id: "william-mutua",
      name: "William Mutua",
      initials: "WM",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/a6ed7a0990cc2c9f3dc489f95625dadc4a1f1e6e-2410x1622.jpg",
      bio: {
        en: "William Mutua is a learning experience designer, facilitator and Master Trainer with more than 12 years of experience across youth employment, education and leadership development. He currently works with Generation Kenya, an education-to-employment programme, and has supported organisations including ALX/TheRoom, Spire Education and the School of Wildlife Conservation. His work centres on designing practical learning experiences that prepare people for work and leadership.",
        fr: "William Mutua est concepteur d’expériences d’apprentissage, facilitateur et formateur de formateurs, avec plus de 12 ans d’expérience dans les domaines de l’emploi des jeunes, de l’éducation et du développement du leadership. Il travaille actuellement avec Generation Kenya, un programme de transition entre l’éducation et l’emploi, et a accompagné des organisations telles que ALX/TheRoom, Spire Education et la School of Wildlife Conservation. Son travail consiste principalement à concevoir des expériences d’apprentissage pratiques qui préparent les individus au monde du travail et au leadership.",
      },
      order: 4,
    },
    {
      id: "ntua-edia",
      name: "Ntua Edia",
      initials: "NE",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/869929a39c8f91b5b640373cfc77091309e5c85d-1280x1585.jpg",
      bio: {
        en: "Ntua Edia is Chief of Staff to the CEO of Fixa, an HR-fintech startup expanding financial services for the informal sector. Her work focuses on organisational performance, cross-functional alignment and building the operational systems that help teams deliver results. With an early career in the creative sector, she also remains passionate about mobilising greater investment and attention toward Africa's creative economy.",
        fr: "Ntua Edia est Chief of Staff auprès du Directeur général de Fixa, une startup spécialisée dans les technologies RH et la fintech, qui développe l’accès aux services financiers pour le secteur informel. Son travail porte sur la performance organisationnelle, l’alignement entre les différentes fonctions et la mise en place de systèmes opérationnels permettant aux équipes d’obtenir des résultats. Ayant commencé sa carrière dans le secteur créatif, elle reste également engagée dans la mobilisation de davantage d’investissements et d’attention en faveur de l’économie créative africaine.",
      },
      order: 5,
    },
    {
      id: "abigail-ndikum",
      name: "Abigail Ndikum",
      initials: "AN",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/c17018becce1bb4a2916975f09fff3ab50848717-2016x3024.jpg",
      bio: {
        en: "Abigail Ndikum is a Cameroonian-American strategist, organiser and advocate focused on strengthening engagement between Africa and the global African diaspora. She founded the Yale Africa Innovation Symposium and works across women's empowerment, civic engagement and youth leadership. Professionally, she advises organisations on strategy and impact while advancing practical pathways for diaspora participation in Africa's development.",
        fr: "Abigail Ndikum est une stratège, organisatrice et défenseure des intérêts d’origine camerounaise et américaine, qui œuvre à renforcer les liens entre l’Afrique et la diaspora africaine mondiale. Elle a fondé le Yale Africa Innovation Symposium et travaille sur des enjeux liés à l’autonomisation des femmes, à l’engagement citoyen et au leadership des jeunes. Dans son activité professionnelle, elle accompagne les organisations sur les questions de stratégie et d’impact tout en développant des voies concrètes permettant à la diaspora de contribuer au développement de l’Afrique.",
      },
      order: 6,
    },
    {
      id: "antonia-bezanilla",
      name: "Antonia Bezanilla",
      initials: "AB",
      imageUrl: "https://cdn.sanity.io/images/r4ex3fmf/production/f605b390ef593233b20193606c21032aaf4f58ec-1900x1900.jpg",
      bio: {
        en: "Antonia Bezanilla is a strategy and education professional whose work spans consulting, public policy and impact investing. A Stanford MBA and Forté Fellow with experience at BCG, she previously advised Chile's Ministry of Education, where she worked on policies to prevent school dropout and support student re-entry. She also contributes to education-focused impact investing and has helped advance women's leadership through Women MBA Chile.",
        fr: "Antonia Bezanilla est une professionnelle de la stratégie et de l’éducation dont le parcours couvre le conseil, les politiques publiques et l’investissement à impact. Titulaire d’un MBA de Stanford et membre du programme Forté Fellow, elle possède une expérience au sein de BCG. Elle a auparavant conseillé le ministère chilien de l’Éducation, où elle a travaillé sur des politiques visant à prévenir le décrochage scolaire et à favoriser le retour des élèves dans le système éducatif. Elle contribue également à des investissements à impact axés sur l’éducation et a participé au développement du leadership féminin à travers Women MBA Chile.",
      },
      order: 7,
    },
  ];

  for (const m of advisoryMembers) {
    await client.createOrReplace({
      _id: `teamMember-${m.id}`,
      _type: "teamMember",
      name: m.name,
      group: "advisoryBoard",
      initials: m.initials,
      bio: m.bio,
      image: sanityUrlToAsset(m.imageUrl),
      order: m.order,
    });
  }

  // 3. Partner Logos
  const partners = [
    { name: "Canva for Nonprofits", url: "https://cdn.sanity.io/images/r4ex3fmf/production/f7c3eedf8d43e00299b92a873e008474d416dfd3-1212x1212.png", order: 1 },
    { name: "European Union", url: "https://cdn.sanity.io/images/r4ex3fmf/production/e6f0743cb701fcfa7b9d37fc0fe03b72c26c309c-4247x891.png", order: 2 },
    { name: "Global Youth Mobilization", url: "https://cdn.sanity.io/images/r4ex3fmf/production/065752634b0d84a1ab34dce30f7aa1327c096457-450x138.png", order: 3 },
    { name: "Global Changemakers", url: "https://cdn.sanity.io/images/r4ex3fmf/production/e819c03ba7a389393ed703ac2f41b7811b86f483-960x490.png", order: 4 },
    { name: "Kofi Annan Changemakers", url: "https://cdn.sanity.io/images/r4ex3fmf/production/c3dc87ed61f34e29b4d515397058580ee074028a-1669x449.jpg", order: 5 },
    { name: "One Young World", url: "https://cdn.sanity.io/images/r4ex3fmf/production/21bfe86aa103f03c90c3c2158b68facb22c729b6-1529x524.png", order: 6 },
    { name: "Melton Foundation", url: "https://cdn.sanity.io/images/r4ex3fmf/production/be9a001c5f1ff5ec906d393e316cedeb41455fad-427x118.png", order: 7 },
    { name: "Peace First", url: "https://cdn.sanity.io/images/r4ex3fmf/production/e4e620326769b6c16153ad0c8767a5931bd343a6-475x185.png", order: 8 },
    { name: "Google for Nonprofits", url: "https://cdn.sanity.io/images/r4ex3fmf/production/7ed34c268946bbcad68aa84f9597a38133cfacb7-1280x720.jpg", order: 9 },
    { name: "monday.com for Nonprofits", url: "https://cdn.sanity.io/images/r4ex3fmf/production/411c86c0d117a9ef3d6a1d084d7d06f0af8fccc2-1659x252.png", order: 10 },
  ];

  for (let i = 0; i < partners.length; i++) {
    const p = partners[i];
    await client.createOrReplace({
      _id: `partnerLogo-${i + 1}`,
      _type: "partnerLogo",
      name: p.name,
      logo: sanityUrlToAsset(p.url),
      order: p.order,
    });
  }
}

async function seedHome() {
  console.log("Seeding Home Page...");

  const [alumni3, alumni4, alumni5] = await Promise.all([
    uploadLocalImage("alumni-3.png"),
    uploadLocalImage("alumni-4.png"),
    uploadLocalImage("alumni-5.png"),
  ]);

  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    // Hero
    heroActiveVariant: "collage-description",
    heroHeadline: {
      en: "Building the bridge from education to meaningful work.",
      fr: "Construire le pont entre l'éducation et un travail porteur de sens.",
    },
    heroDescription: {
      en: "Impact Axis is a Cameroon-based nonprofit helping young people build the practical skills, experience and networks they need to access meaningful and dignified work. We do this through experiential learning, mentorship and applied projects.",
      fr: "Impact Axis est une organisation à but non lucratif basée au Cameroun qui aide les jeunes à développer les compétences pratiques, l'expérience et les réseaux dont ils ont besoin pour accéder à un travail significatif et digne. Nous y parvenons par l'apprentissage expérientiel, le mentorat et des projets appliqués.",
    },
    heroCtaLabel: {
      en: "Explore our work",
      fr: "Découvrir notre travail",
    },

    // Why We Exist
    wweEyebrow: { en: "Why We Exist", fr: "Notre raison d'être" },
    wweHeadline: {
      en: "Young Cameroonians are completing school. Too many still lack a clear path to meaningful work.",
      fr: "Les jeunes Camerounais terminent leurs études. Trop d'entre eux manquent encore d'un chemin clair vers un travail porteur de sens.",
    },
    wweParagraph1: {
      en: "Education provides knowledge, but moving into work also requires practical skills, relevant experience, guidance and professional networks. Too many young people are left to build these alone, making access to opportunity slower and more unequal.",
      fr: "L'éducation apporte des connaissances, mais l'accès au travail exige aussi des compétences pratiques, une expérience pertinente, un accompagnement et des réseaux professionnels. Trop de jeunes doivent construire cela seuls, ce qui rend l'accès aux opportunités plus lent et plus inégal.",
    },
    wweParagraph2: {
      en: "Impact Axis exists to close this gap by helping young people turn their education and potential into the capabilities, experience and connections needed for meaningful work.",
      fr: "Impact Axis existe pour combler cet écart en aidant les jeunes à transformer leur éducation et leur potentiel en compétences, expérience et connexions nécessaires à un travail porteur de sens.",
    },

    // Solution
    solutionEyebrow: { en: "Our Solution", fr: "Notre solution" },
    solutionHeadline: {
      en: "Practical skills. Real experience. Stronger pathways to work.",
      fr: "Des compétences pratiques. Une expérience réelle. Des parcours plus solides vers l'emploi.",
    },
    solutionButtonLabel: { en: "Explore our approach", fr: "Découvrir notre approche" },
    solutionParagraphs: [
      {
        _key: "p1",
        en: "Through youth workforce development programmes in Cameroon, Impact Axis combines experiential learning, mentorship, applied projects and access to professional networks. Young people build durable skills, practise in real-world contexts, demonstrate what they can do and connect to opportunities.",
        fr: "Grâce à ses programmes de développement de l'employabilité des jeunes au Cameroun, Impact Axis combine apprentissage expérientiel, mentorat, projets appliqués et accès à des réseaux professionnels. Les jeunes développent des compétences durables, s'exercent en conditions réelles, démontrent ce dont ils sont capables et se connectent à des opportunités.",
      },
      {
        _key: "p2",
        en: "This structured approach makes the transition from education to meaningful and dignified work more practical, supported and equitable.",
        fr: "Cette approche structurée rend la transition de l'éducation vers un travail significatif et digne plus concrète, mieux accompagnée et plus équitable.",
      },
      {
        _key: "p3",
        en: "Focusing on durable skills and applied experience rather than credentials alone shortens the transition from education to employment and enables young talent to access meaningful opportunity with clarity and competence.",
        fr: "En privilégiant les compétences durables et l'expérience appliquée plutôt que les seuls diplômes, nous raccourcissons la transition entre l'éducation et l'emploi et permettons aux jeunes talents d'accéder à des opportunités significatives avec clarté et compétence.",
      },
    ],

    // What We Build
    wwbOverlayEyebrow: { en: "What We Build", fr: "Ce que nous construisons" },
    wwbOverlayHeadline: {
      en: "A practical pathway from learning to work.",
      fr: "Un parcours concret de l'apprentissage vers l'emploi.",
    },
    wwbSlides: [
      {
        _key: "slide1",
        legendLabel: { en: "Skills for Work", fr: "Compétences pour le travail" },
        headline: { en: "Skills for Work", fr: "Compétences pour le travail" },
        description: {
          en: "Experiential learning that develops the communication, problem-solving, teamwork, digital fluency and self-leadership skills young people need to navigate the workplace.",
          fr: "Un apprentissage expérientiel qui développe la communication, la résolution de problèmes, le travail d'équipe, l'aisance numérique et le leadership personnel dont les jeunes ont besoin pour évoluer en milieu professionnel.",
        },
        image: alumni3,
        buttonLabel: { en: "Explore our programmes", fr: "Découvrir nos programmes" },
        buttonHref: "/programs",
      },
      {
        _key: "slide2",
        legendLabel: { en: "Experience That Builds Confidence", fr: "Une expérience qui renforce la confiance" },
        headline: { en: "Experience That Builds Confidence", fr: "Une expérience qui renforce la confiance" },
        description: {
          en: "Projects, simulations and real-world challenges give young people opportunities to apply what they learn, solve problems and build evidence of what they can do.",
          fr: "Des projets, des simulations et des mises en situation réelles donnent aux jeunes l'occasion d'appliquer ce qu'ils apprennent, de résoudre des problèmes et de démontrer concrètement ce dont ils sont capables.",
        },
        image: alumni4,
        buttonLabel: { en: "See our approach", fr: "Découvrir notre approche" },
        buttonHref: "/about",
      },
      {
        _key: "slide3",
        legendLabel: { en: "Connections to Opportunity", fr: "Des connexions vers l'opportunité" },
        headline: { en: "Connections to Opportunity", fr: "Des connexions vers l'opportunité" },
        description: {
          en: "Mentorship, career guidance, professional networks and employer exposure help young people understand their options, build relationships and access meaningful opportunities.",
          fr: "Le mentorat, l'orientation professionnelle, les réseaux professionnels et l'exposition aux employeurs aident les jeunes à comprendre leurs options, à tisser des relations et à accéder à des opportunités porteuses de sens.",
        },
        image: alumni5,
        buttonLabel: { en: "Discover the pathway", fr: "Découvrir le parcours" },
        buttonHref: "/programs",
      },
    ],

    // Who We Serve
    wwsEyebrow: { en: "Who We Work With", fr: "Avec qui nous travaillons" },
    wwsCards: [
      {
        _key: "c1",
        number: "01",
        label: { en: "Young People", fr: "Jeunes" },
        description: {
          en: "Build practical skills, gain real-world experience and access the mentorship and networks needed to move into meaningful work.",
          fr: "Développez des compétences pratiques, acquérez une expérience concrète et accédez au mentorat et aux réseaux nécessaires pour accéder à un travail porteur de sens.",
        },
      },
      {
        _key: "c2",
        number: "02",
        label: { en: "Funding & Development Partners", fr: "Partenaires de financement et de développement" },
        description: {
          en: "Fund and scale youth workforce programmes that expand access to opportunity and deliver measurable outcomes for young people.",
          fr: "Financez et développez à grande échelle des programmes d'employabilité des jeunes qui élargissent l'accès aux opportunités et produisent des résultats mesurables pour les jeunes.",
        },
      },
      {
        _key: "c3",
        number: "03",
        label: { en: "Employers & Education Partners", fr: "Employeurs et partenaires éducatifs" },
        description: {
          en: "Co-create practical pathways that connect young people with workplace exposure, mentorship and meaningful opportunities.",
          fr: "Co-créez des parcours concrets qui connectent les jeunes à une exposition au monde du travail, à du mentorat et à des opportunités porteuses de sens.",
        },
      },
    ],

    // Our Impact (chrome)
    impactEyebrow: { en: "Our Impact", fr: "Notre impact" },
    impactParagraph: {
      en: "We measure progress by what young people can do next. Our impact goes beyond participation — we track whether young people build stronger capabilities, access meaningful opportunities and leave our programmes better positioned for work and life.",
      fr: "Nous mesurons les progrès à travers ce que les jeunes sont capables de faire ensuite. Notre impact va au-delà de la simple participation — nous suivons si les jeunes développent des compétences plus fortes, accèdent à des opportunités porteuses de sens et terminent nos programmes mieux préparés pour le travail et la vie.",
    },
    impactReportCta: {
      en: "Explore our impact",
      fr: "Découvrir notre impact",
    },

    // Bottom CTA
    bottomCtaTitle: {
      en: "Ready to start a conversation with us?",
      fr: "Prêt à entamer une conversation avec nous ?",
    },
    bottomCtaButtonLabel: {
      en: "Get in touch",
      fr: "Contactez-nous",
    },
  });
}

async function main() {
  await seedTeamAndPartners();
  await seedHome();
  console.log("Successfully seeded all active page content to Sanity!");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
