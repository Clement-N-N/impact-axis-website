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

async function seedJourney() {
  console.log("Seeding Journey Page...");

  await client.createOrReplace({
    _id: "journeyPage",
    _type: "journeyPage",
    heroBadge: {
      en: "Our Journey",
      fr: "Notre parcours",
    },
    heroHeadline: {
      en: "A Journey of Evolution",
      fr: "Un parcours en constante évolution",
    },
    heroSubtitle: {
      en: "From a university research inquiry in 2021 to an enduring talent and workforce systems builder in 2025 and beyond.",
      fr: "D’une recherche universitaire menée en 2021 à la construction de systèmes durables pour le développement des talents et de la main-d’œuvre en 2025 et au-delà.",
    },
    heroBackLink: {
      en: "Back to About Us",
      fr: "Retour À propos de nous",
    },
    ctaTag: {
      en: "Next in Our Story",
      fr: "La suite de notre histoire",
    },
    ctaHeadline: {
      en: "Help us build what comes next.",
      fr: "Aidez-nous à construire la suite.",
    },
    ctaParagraph: {
      en: "Whether through funding, mentorship, workplace exposure, programme partnerships or access to opportunity, there are many ways to help more young people move from education into meaningful work.",
      fr: "Que ce soit par le financement, le mentorat, l’immersion professionnelle, les partenariats de programmes ou l’accès aux opportunités, il existe de nombreuses façons d’aider davantage de jeunes à passer de l’éducation à un travail porteur de sens.",
    },
    ctaPartner: {
      en: "Partner with us →",
      fr: "Devenir partenaire →",
    },
    ctaReports: {
      en: "Our Yearly Reports",
      fr: "Nos rapports annuels",
    },
  });

  const milestones = [
    {
      year: "2021",
      shortYear: "21",
      badge: { en: "Pilot Launch", fr: "Lancement du projet pilote" },
      phase: { en: "Inception", fr: "Création" },
      title: { en: "2021 — Our Genesis", fr: "2021 — Nos origines" },
      description: {
        en: "After his first semester of sophomore year at Ashesi University, Clement took a research course to understand what skills young Cameroonians believed they needed to thrive in the world of work. That work led to the launch of Impact Axis and the first Goodwill Fellowship pilot, with support from Global Changemakers and Melton Foundation.",
        fr: "Après son premier semestre de deuxième année à Ashesi University, Clement a suivi un cours de recherche afin de comprendre quelles compétences les jeunes Camerounais estimaient nécessaires pour réussir dans le monde du travail. Ces travaux ont conduit à la création d’Impact Axis et au lancement du premier projet pilote du Goodwill Fellowship, avec le soutien de Global Changemakers et de la Melton Foundation.",
      },
      yearSubtitle: { en: "Foundation & Initial Research", fr: "Fondation et recherche initiale" },
      tags: ["Ashesi University", "Global Changemakers", "Melton Foundation"],
    },
    {
      year: "2022",
      shortYear: "22",
      badge: { en: "Critical Insight", fr: "Prise de conscience décisive" },
      phase: { en: "Scaling Responsibly", fr: "Changer d’échelle de manière responsable" },
      title: { en: "2022 — A Failed Experiment", fr: "2022 — Une expérience qui a échoué" },
      description: {
        en: "After a successful pilot with 16 fellows, Clement used his savings to double the next cohort. The ambition was strong, but the high-touch model and lean team made growth difficult to sustain. It was a hard year, but an important lesson in scaling responsibly.",
        fr: "Après un projet pilote réussi avec 16 fellows, Clement a utilisé ses économies pour doubler la taille de la cohorte suivante. L’ambition était forte, mais le modèle d’accompagnement intensif et la taille réduite de l’équipe ont rendu cette croissance difficile à maintenir. Ce fut une année difficile, mais une leçon importante sur la nécessité de changer d’échelle de manière responsable.",
      },
      yearSubtitle: { en: "Pivotal Learning Curve", fr: "Une phase d’apprentissage décisive" },
      tags: ["Cohort Scaling", "Lean Operational Architecture"],
    },
    {
      year: "2023",
      shortYear: "23",
      badge: { en: "Limbe Retreat", fr: "Retraite de Limbe" },
      phase: { en: "Strategic Recalibration", fr: "Recalibrage stratégique" },
      title: { en: "2023 — Reflection & Learning", fr: "2023 — Réflexion et apprentissage" },
      description: {
        en: "After the difficulties of the previous year, we received support from the Kofi Annan Foundation to host a retreat in Limbe with alumni of the fellowship. The retreat created space to reflect honestly on what had worked, what had not, and how the programme could be redesigned for deeper impact.",
        fr: "Après les difficultés rencontrées l’année précédente, nous avons reçu le soutien de la Kofi Annan Foundation pour organiser une retraite à Limbe avec les anciens participants du fellowship. Cette retraite nous a permis de réfléchir ouvertement à ce qui avait fonctionné, à ce qui n’avait pas fonctionné et à la manière de repenser le programme afin d’accroître son impact.",
      },
      yearSubtitle: { en: "Honest Reflection & Redesign", fr: "Réflexion honnête et refonte" },
      tags: ["Kofi Annan Foundation", "Alumni Forum Limbe"],
    },
    {
      year: "2024",
      shortYear: "24",
      badge: { en: "Core Resumption", fr: "Reprise des activités principales" },
      phase: { en: "Deeper Transformation", fr: "Transformation approfondie" },
      title: { en: "2024 — Year of Return", fr: "2024 — L’année du retour" },
      description: {
        en: "We resumed the Goodwill Fellowship with stronger programming, clearer focus, and a deeper understanding of the transformation we aim to create, thanks to continued support from the Kofi Annan Foundation.",
        fr: "Nous avons relancé le Goodwill Fellowship avec une programmation renforcée, une orientation plus claire et une compréhension plus approfondie de la transformation que nous souhaitons créer, grâce au soutien continu de la Kofi Annan Foundation.",
      },
      yearSubtitle: { en: "Relaunch & Clarity", fr: "Relance et clarté" },
      tags: ["Goodwill Fellowship Relaunch", "Kofi Annan Foundation"],
    },
    {
      year: "2025",
      shortYear: "25",
      badge: { en: "Systems Scale", fr: "Changement d’échelle des systèmes" },
      phase: { en: "Multi-Cohort Expansion", fr: "Expansion multi-cohortes" },
      title: { en: "2025 — Laying the Foundations", fr: "2025 — Poser les fondations" },
      description: {
        en: "With support from Global Youth Mobilization, we tested running more than one fellowship cohort each year while beginning to build the systems and partnerships needed for long-term sustainability.",
        fr: "Avec le soutien de Global Youth Mobilization, nous avons expérimenté l’organisation de plusieurs cohortes du fellowship par an, tout en commençant à mettre en place les systèmes et les partenariats nécessaires à notre pérennité à long terme.",
      },
      yearSubtitle: { en: "Multi-Cohort Systems & Scale", fr: "Systèmes multi-cohortes et changement d’échelle" },
      tags: ["Goodwill Fellowship Expansion", "Multiple Cohorts", "Systems Building"],
    },
    {
      year: "2026",
      shortYear: "26",
      badge: { en: "In Progress", fr: "En cours" },
      phase: { en: "Building What Comes Next", fr: "Construire la suite" },
      title: { en: "2026 — Building What Comes Next", fr: "2026 — Construire la suite" },
      description: {
        en: "The journey continues. We are strengthening our programmes, systems and partnerships to build more sustainable pathways from education to meaningful work for young people across Cameroon.",
        fr: "Le parcours continue. Nous renforçons nos programmes, nos systèmes et nos partenariats afin de construire des parcours plus durables entre l’éducation et un travail porteur de sens pour les jeunes à travers le Cameroun.",
      },
      yearSubtitle: { en: "Systems & Sustainability", fr: "Systèmes et pérennité" },
      tags: ["Programme Strengthening", "Systems Building", "Partnership Development"],
    },
  ];

  for (const m of milestones) {
    await client.createOrReplace({
      _id: `journeyMilestone-${m.year}`,
      _type: "journeyMilestone",
      ...m,
    });
  }
}

async function seedAbout() {
  console.log("Seeding About Page...");

  // 1. About Page Singleton
  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    // Hero
    heroHeadline: {
      en: "We are building stronger pathways from education to meaningful work.",
      fr: "Nous construisons des passerelles plus solides entre l’éducation et l’accès à un travail porteur de sens.",
    },
    heroParagraph: {
      en: "Impact Axis is a Cameroon-based nonprofit youth workforce development organisation. We help young people build the capabilities, experience and connections they need to navigate the transition from education into meaningful and dignified work.",
      fr: "Impact Axis est une organisation camerounaise à but non lucratif qui œuvre au développement de l’employabilité et des parcours professionnels des jeunes. Nous aidons les jeunes à développer les compétences, l’expérience et les connexions dont ils ont besoin pour réussir leur transition de l’éducation vers un travail épanouissant et digne.",
    },
    heroCtaPartner: {
      en: "Partner with us",
      fr: "Devenir partenaire",
    },
    heroCtaStory: {
      en: "Learn our story",
      fr: "Découvrir notre histoire",
    },

    // Why We Exist
    wweEyebrow: {
      en: "Youth workforce development in Cameroon",
      fr: "Développement de l’employabilité des jeunes au Cameroun",
    },
    wweHeadline: {
      en: "Talent is everywhere. Access to opportunity is not.",
      fr: "Les talents sont partout. L’accès aux opportunités ne l’est pas.",
    },
    wweParagraph1: {
      en: "Across Cameroon, many young people complete their education with ambition and potential, yet enter the world of work without enough practical experience, career guidance, professional networks or exposure to opportunity.",
      fr: "Au Cameroun, de nombreux jeunes terminent leurs études avec de l’ambition et du potentiel, mais entrent dans le monde du travail sans disposer de suffisamment d’expérience pratique, d’orientation professionnelle, de réseaux ou d’accès aux opportunités.",
    },
    wweParagraph2: {
      en: "We do not see employability as a training problem alone. Young people need opportunities to learn, practise, build relationships and navigate what comes next.",
      fr: "Nous ne considérons pas l’employabilité comme un simple problème de formation. Les jeunes ont besoin d’occasions d’apprendre, de mettre leurs connaissances en pratique, de créer des relations et de mieux préparer leur avenir professionnel.",
    },
    wweCallout: {
      en: "Impact Axis exists to strengthen this transition, making the path from education to meaningful work more practical, supported and equitable.",
      fr: "Impact Axis existe pour renforcer cette transition et rendre le passage de l’éducation vers un travail porteur de sens plus concret, mieux accompagné et plus équitable.",
    },
    wweImageCaptionHeader: {
      en: "Empowering The Next Generation",
      fr: "Donner les moyens d’agir à la prochaine génération",
    },
    wweImageCaptionBody: {
      en: "Collaborative workshops bridging classroom training with active market-aligned skills.",
      fr: "Des ateliers collaboratifs qui font le lien entre les apprentissages en salle de classe et les compétences concrètes recherchées sur le marché du travail.",
    },

    // Mission & Vision
    missionTitle: { en: "Mission", fr: "Mission" },
    missionBody: {
      en: "To enable young people build the capabilities, experience and connections needed to move from education into meaningful work.",
      fr: "Permettre aux jeunes de développer les compétences, l’expérience et les connexions nécessaires pour passer de l’éducation à un travail porteur de sens.",
    },
    visionTitle: { en: "Vision", fr: "Vision" },
    visionBody: {
      en: "A future where young Africans can translate their talent and education into meaningful livelihoods.",
      fr: "Un avenir où les jeunes Africains peuvent transformer leurs talents et leur éducation en moyens de subsistance durables et épanouissants.",
    },

    // Our Approach
    approachEyebrow: { en: "Our Approach", fr: "Notre approche" },
    approachHeadline: { en: "Learn. Apply. Connect.", fr: "Apprendre. Mettre en pratique. Se connecter." },
    approachSubtitle: {
      en: "Our youth workforce development model brings together three things young people need to move more confidently from learning into opportunity.",
      fr: "Notre modèle de développement de l’employabilité des jeunes réunit trois éléments essentiels pour leur permettre de passer plus sereinement de l’apprentissage aux opportunités professionnelles.",
    },
    approachSteps: [
      {
        _key: "step1",
        stepNumber: "01",
        title: { en: "Learn", fr: "Apprendre" },
        subtitle: { en: "Build capabilities for work", fr: "Développer les compétences utiles au monde du travail" },
        description: {
          en: "Through experiential learning, young people strengthen communication, problem-solving, teamwork, self-leadership, digital fluency and other durable skills needed to navigate a changing world of work.",
          fr: "Grâce à un apprentissage expérientiel, les jeunes renforcent leur communication, leur capacité à résoudre des problèmes, leur esprit d’équipe, leur autonomie, leur maîtrise du numérique et d’autres compétences durables nécessaires pour évoluer dans un monde du travail en constante évolution.",
        },
      },
      {
        _key: "step2",
        stepNumber: "02",
        title: { en: "Apply", fr: "Mettre en pratique" },
        subtitle: { en: "Turn learning into experience", fr: "Transformer les apprentissages en expérience" },
        description: {
          en: "Projects, simulations and real-world challenges give young people opportunities to practise what they learn, solve problems and demonstrate what they can do.",
          fr: "Les projets, les simulations et les défis inspirés de situations réelles permettent aux jeunes de mettre en pratique ce qu’ils apprennent, de résoudre des problèmes et de démontrer concrètement ce dont ils sont capables.",
        },
      },
      {
        _key: "step3",
        stepNumber: "03",
        title: { en: "Connect", fr: "Se connecter" },
        subtitle: { en: "Build pathways to opportunity", fr: "Créer des passerelles vers les opportunités" },
        description: {
          en: "Mentorship, career guidance, professional networks and exposure to opportunities help young people navigate their next steps and build relationships that support their progression.",
          fr: "Le mentorat, l’orientation professionnelle, les réseaux professionnels et l’accès aux opportunités aident les jeunes à mieux préparer leurs prochaines étapes et à construire des relations qui favorisent leur progression.",
        },
      },
    ],
    approachSummaryBanner: {
      en: "Together, these experiences create a stronger bridge between education and meaningful work.",
      fr: "Ensemble, ces expériences créent une passerelle plus solide entre l’éducation et un travail porteur de sens.",
    },

    // Our Story
    storyEyebrow: { en: "Our Story", fr: "Notre histoire" },
    storyHeadline: {
      en: "From creating opportunities to building pathways.",
      fr: "De la création d’opportunités à la construction de parcours.",
    },
    storyPhotoBadgeTag: { en: "Origins · Yaoundé", fr: "Origines · Yaoundé" },
    storyPhotoBadgeCaption: {
      en: "Youth-led learning and mentorship initiatives that became the foundation of Impact Axis.",
      fr: "Des initiatives d’apprentissage et de mentorat portées par des jeunes, devenues le socle d’Impact Axis.",
    },
    storyParagraph1: {
      en: "Impact Axis grew from years of working alongside young people navigating education, careers, leadership and opportunity in Cameroon.",
      fr: "Impact Axis est née de plusieurs années de collaboration avec des jeunes confrontés aux enjeux liés à l’éducation, à l’insertion professionnelle, au leadership et à l’accès aux opportunités au Cameroun.",
    },
    storyParagraph2: {
      en: "What began as youth-led learning and mentorship initiatives evolved into the Goodwill Fellowship in 2021, creating a more structured way for young people to develop skills, build relationships and prepare for opportunities.",
      fr: "Ce qui a commencé comme des initiatives d’apprentissage et de mentorat portées par des jeunes a évolué en 2021 avec la création du Goodwill Fellowship, offrant aux jeunes un cadre plus structuré pour développer leurs compétences, créer des relations et se préparer aux opportunités.",
    },
    storyParagraph3: {
      en: "As our work grew, so did our understanding of the challenge. Skills matter, but young people also need experience, guidance, networks and clearer pathways into the world of work.",
      fr: "À mesure que notre action s’est développée, notre compréhension du défi s’est également approfondie. Les compétences sont importantes, mais les jeunes ont également besoin d’expérience, d’accompagnement, de réseaux et de parcours plus clairs vers le monde du travail.",
    },
    storyParagraph4: {
      en: "In 2024, Youths Inspiration became Impact Axis, reflecting a more focused ambition: to strengthen how young people move from education into meaningful work.",
      fr: "En 2024, Youths Inspiration est devenue Impact Axis, traduisant une ambition plus ciblée : renforcer la manière dont les jeunes passent de l’éducation à un travail porteur de sens.",
    },
    storyTimelineBadge: { en: "Our Journey", fr: "Notre parcours" },
    storyTimelineText: { en: "Read our journey", fr: "Découvrir notre parcours" },

    // Our Principles
    principlesEyebrow: { en: "Our Principles", fr: "Nos principes" },
    principlesHeadline: { en: "How we build matters.", fr: "La manière dont nous construisons compte." },
    principles: [
      {
        _key: "p1",
        title: { en: "Youth at the centre", fr: "Les jeunes au cœur de notre action" },
        description: {
          en: "We listen to young people, involve them in the learning process and design around the realities they face.",
          fr: "Nous écoutons les jeunes, les impliquons dans le processus d’apprentissage et concevons nos initiatives en tenant compte des réalités auxquelles ils sont confrontés.",
        },
      },
      {
        _key: "p2",
        title: { en: "Learning by doing", fr: "Apprendre par la pratique" },
        description: {
          en: "We believe capability develops through practice, feedback, reflection and real-world application.",
          fr: "Nous croyons que les compétences se développent par la pratique, le feedback, la réflexion et la mise en application dans des situations réelles.",
        },
      },
      {
        _key: "p3",
        title: { en: "Access with equity", fr: "Un accès fondé sur l’équité" },
        description: {
          en: "Opportunity should not depend only on where someone comes from, who they know or what they can afford. We work to widen access for young people who have historically had fewer opportunities.",
          fr: "L’accès aux opportunités ne devrait pas dépendre uniquement du lieu où l’on est né, de ses relations ou de ses moyens financiers. Nous œuvrons à élargir l’accès pour les jeunes qui ont historiquement bénéficié de moins d’opportunités.",
        },
      },
      {
        _key: "p4",
        title: { en: "Outcomes that matter", fr: "Des résultats qui comptent" },
        description: {
          en: "Participation is only the beginning. We care about whether young people become more capable, more connected and better positioned to progress into meaningful opportunities.",
          fr: "La participation n’est qu’un début. Nous nous intéressons surtout à la capacité des jeunes à devenir plus compétents, mieux connectés et mieux préparés à saisir des opportunités porteuses de sens.",
        },
      },
    ],

    // Our People (section chrome)
    peopleEyebrow: { en: "Our People", fr: "Notre équipe" },
    peopleHeadline: {
      en: "Built by people who believe in what young people can become.",
      fr: "Construite par des personnes qui croient au potentiel des jeunes.",
    },
    peopleSubtitle: {
      en: "Our team brings together experience across programme design, education, research, communications, community building and youth development, united by a shared commitment to improving how young people move from learning into opportunity.",
      fr: "Notre équipe réunit des expériences variées en conception de programmes, éducation, recherche, communication, développement communautaire et développement de la jeunesse, autour d’un même engagement : améliorer la manière dont les jeunes passent de l’apprentissage aux opportunités.",
    },
    coreTeamHeader: { en: "Core Team", fr: "Équipe principale" },
    coreTeamSubheader: { en: "Leadership & Operations", fr: "Direction & opérations" },
    advisoryBoardHeader: { en: "Advisory Board", fr: "Conseil consultatif" },
    advisoryBoardSubheader: { en: "Strategic Guidance & Governance", fr: "Orientation stratégique & gouvernance" },

    // Partnership
    partnershipEyebrow: { en: "Collaborative Ecosystem", fr: "Un écosystème collaboratif" },
    partnershipHeadline: {
      en: "Stronger pathways to work are built together.",
      fr: "Des parcours plus solides vers l’emploi se construisent ensemble.",
    },
    partnershipSubtitle: {
      en: "We collaborate with funders, development organisations, employers, education institutions, mentors and other partners to expand access to skills, experience and meaningful opportunities for young people.",
      fr: "Nous collaborons avec des bailleurs de fonds, des organisations de développement, des employeurs, des établissements d’enseignement, des mentors et d’autres partenaires afin d’élargir l’accès des jeunes aux compétences, à l’expérience et à des opportunités porteuses de sens.",
    },
    leftBannerHeadline: { en: "Help us build what comes next.", fr: "Aidez-nous à construire la suite." },
    leftBannerParagraph: {
      en: "Whether through funding, mentorship, workplace exposure, programme partnerships or access to opportunity, there are many ways to help more young people move from education into meaningful work.",
      fr: "Que ce soit par le financement, le mentorat, l’immersion professionnelle, les partenariats de programmes ou l’accès aux opportunités, il existe de nombreuses façons d’aider davantage de jeunes à passer de l’éducation à un travail porteur de sens.",
    },
    leftBannerCtaLabel: { en: "Partner with us →", fr: "Devenir partenaire →" },
    rightBannerHeadline: {
      en: "Ready to start a conversation with us?",
      fr: "Prêt à entamer une conversation avec nous ?",
    },
    rightBannerParagraph: {
      en: "Explore how your organisation, company, or institution can co-create practical internships and mentoring pathways for youth in Cameroon.",
      fr: "Découvrez comment votre organisation, entreprise ou institution peut co-créer des parcours concrets de stages et de mentorat pour les jeunes au Cameroun.",
    },
    rightBannerCtaLabel: { en: "Get in touch", fr: "Nous contacter" },
    rightBannerEmail: "info@impact-axis.org",
  });

  // 2. Team Members
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
  await seedJourney();
  await seedAbout();
  await seedHome();
  console.log("Successfully seeded all active page content to Sanity!");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
