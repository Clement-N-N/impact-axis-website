import type { AboutPageContent } from "./types";

// Assets already uploaded to the Sanity dataset. Referencing them by CDN URL
// keeps the photography out of the repo and avoids re-uploading anything when
// this content is moved into Sanity later — the asset ids below are the same
// ones the documents point at today.
const CDN = "https://cdn.sanity.io/images/r4ex3fmf/production";

/**
 * Ask Sanity's CDN for a sensibly sized source before `next/image` ever sees
 * it. The originals behind these photographs are 6960x4640 — around 32
 * megapixels and 4MB each — and Next's image optimizer returns a 500 for
 * every requested width when handed something that large, so the images
 * simply did not render. 2000px wide is more than enough for a full-bleed
 * band on a 2x display, and `next/image` still produces the responsive
 * variants from there.
 */
const photo = (asset: string) => `${CDN}/${asset}?w=2000&auto=format&fit=max`;

const PHOTO = {
  /** The Goodwill Fellowship group shot used in the design for the hero band
      and the principles section. */
  fellowshipGroup: photo(
    "8766500ae932668227956d446653ef27c3e49ee3-6960x4640.jpg",
  ),
  portrait: photo("f4d8bf08c6ef0cab78261a68285555ea0e62c48a-6960x4640.jpg"),
  workshop: photo("71462aa88345d5001153174afa6e18141b1b9255-6960x4640.jpg"),
  cohort2024: photo("bbc55c36c65b3937c0e8b44006ae2debe13142d6-6080x4640.jpg"),
} as const;

/**
 * Generic alt text: these are group photographs of programme participants and
 * none of them carries information the surrounding copy does not already
 * state. A real description of who is pictured should come from someone who
 * was there — see the accessible-components skill on not inventing alt text.
 */
const GROUP_PHOTO_ALT = {
  en: "Impact Axis programme participants together at a Goodwill Fellowship event",
  fr: "Participants aux programmes d'Impact Axis réunis lors d'un événement Goodwill Fellowship",
};

export const aboutPageContent: AboutPageContent = {
  hero: {
    headline: {
      en: "We are *building stronger* pathways from education to *meaningful work*.",
      fr: "Nous construisons des *passerelles plus solides* entre l’éducation et un *travail porteur de sens*.",
    },
    paragraph: {
      en: "Impact Axis is a Cameroon-based nonprofit youth workforce development organisation. We help young people build the capabilities, experience and connections they need to navigate the transition from education into meaningful and dignified work.",
      fr: "Impact Axis est une organisation à but non lucratif basée au Cameroun, dédiée au développement de l’employabilité des jeunes. Nous aidons les jeunes à acquérir les compétences, l’expérience et les relations dont ils ont besoin pour réussir la transition de l’éducation vers un travail porteur de sens et digne.",
    },
    cta: {
      label: { en: "Discover our impact", fr: "Découvrir notre impact" },
      href: "/impact",
    },
    // Cut-out of the 2026 Goodwill Fellowship cohort (transparent
    // background), layered over the hero's navy floor. A local file rather
    // than the Sanity CDN because it is the page's LCP image.
    image: {
      src: "/images/about-hero-cohort-posed.png",
      alt: {
        en: "The 2026 Goodwill Fellowship cohort in blue and white Impact Axis T-shirts, smiling together, two of them holding their phones up high",
        fr: "La promotion 2026 de la Goodwill Fellowship en T-shirts Impact Axis bleus et blancs, souriante, dont deux membres brandissent leur téléphone",
      },
    },
  },

  imageBand: {
    caption: {
      en: "Youth workforce development in Cameroon",
      fr: "Développement de l'employabilité des jeunes au Cameroun",
    },
    image: { src: PHOTO.fellowshipGroup, alt: GROUP_PHOTO_ALT },
  },

  whyWeExist: {
    eyebrow: { en: "Why we exist", fr: "Notre raison d’être" },
    tagline: {
      lead: { en: "Talent is everywhere.", fr: "Le talent est partout." },
      turn: {
        en: "Access to opportunity is not.",
        fr: "L’accès aux opportunités ne l’est pas.",
      },
    },
    intro: {
      en: "Across Cameroon, many young people complete their education with ambition and potential, yet enter the world of work without enough practical experience, career guidance, professional networks or exposure to opportunity.",
      fr: "Partout au Cameroun, de nombreux jeunes terminent leurs études avec de l’ambition et du potentiel, mais entrent dans le monde du travail sans expérience pratique suffisante, sans orientation professionnelle, sans réseaux professionnels ni exposition aux opportunités.",
    },
    paragraphs: [
      {
        en: "We do not see employability as a training problem alone. Young people need opportunities to learn, practise, build relationships and navigate what comes next.",
        fr: "Nous ne considérons pas l’employabilité comme un simple problème de formation. Les jeunes ont besoin d’occasions d’apprendre, de pratiquer, de nouer des relations et de s’orienter vers la suite.",
      },
      {
        en: "Impact Axis exists to strengthen this transition, making the path from education to meaningful work more practical, supported and equitable.",
        fr: "Impact Axis existe pour renforcer cette transition, en rendant le chemin de l’éducation vers un travail porteur de sens plus concret, mieux accompagné et plus équitable.",
      },
    ],
    image: {
      src: "/images/why-we-exist-career-fair.jpg",
      alt: {
        en: "A young man reads a sheet of paper with his hand on his head in a busy queue at a career event",
        fr: "Un jeune homme lit une feuille, la main sur la tête, dans une file animée lors d’un événement carrière",
      },
    },
    cta: {
      label: { en: "Partner with us", fr: "Devenir partenaire" },
      href: "/work-with-us",
    },
  },

  missionVision: {
    eyebrow: { en: "Mission & Vision", fr: "Mission et vision" },
    missionTitle: { en: "Our Mission", fr: "Notre mission" },
    missionBody: {
      en: "To enable young people to build the [capabilities], [experience] and [connections] needed to move from education into {meaningful work}.",
      fr: "Permettre aux jeunes d'acquérir les [compétences], l'[expérience] et les [relations] nécessaires pour passer de l'éducation à {un travail porteur de sens}.",
    },
    visionTitle: { en: "Our Vision", fr: "Notre vision" },
    visionBody: {
      en: "A future where young Africans can translate their [talent] and [education] into {meaningful livelihoods}.",
      fr: "Un avenir où les jeunes Africains peuvent transformer leur [talent] et leur [éducation] en {moyens de subsistance porteurs de sens}.",
    },
  },

  photoStrip: {
    kicker: { en: "How we work", fr: "Notre façon de faire" },
    headlineLead: { en: "Talent,", fr: "Le talent," },
    headlineAccent: { en: "put to work.", fr: "mis à l'œuvre." },
    images: [
      {
        src: "/images/gallery/gwf-2025-39.jpg",
        alt: {
          en: "Fellows in yellow t-shirts planning together around a table covered in sticky notes",
          fr: "Des fellows en t-shirts jaunes planifiant ensemble autour d'une table couverte de post-it",
        },
      },
      {
        src: "/images/gallery/gwf-2026-32.jpg",
        alt: {
          en: "Two fellows presenting their group's work",
          fr: "Deux fellows présentant le travail de leur groupe",
        },
      },
      {
        src: "/images/gallery/nsai-heroes-49.jpg",
        alt: {
          en: "Two pupils wiring a solar device together",
          fr: "Deux élèves câblant ensemble un dispositif solaire",
        },
      },
      {
        src: "/images/gallery/hive-001-30.jpg",
        alt: {
          en: "Participants in a group discussion outdoors",
          fr: "Des participants en discussion de groupe en plein air",
        },
      },
      {
        src: "/images/gallery/gwf-2024-43.jpg",
        alt: {
          en: "Six fellows smiling side by side",
          fr: "Six fellows souriants côte à côte",
        },
      },
    ],
  },

  ourApproach: {
    eyebrow: { en: "Our Approach", fr: "Notre approche" },
    tagline: {
      en: "Learn. Apply. Connect.",
      fr: "Apprendre. Appliquer. Connecter.",
    },
    title: {
      en: "Building the bridge, plank by plank.",
      fr: "Construire la passerelle, planche par planche.",
    },
    bridgeStart: { en: "Education", fr: "Éducation" },
    bridgeEnd: { en: "Meaningful work", fr: "Travail porteur de sens" },
    headline: {
      en: "Our youth workforce development model brings together three things young people need to move more confidently from learning into opportunity.",
      fr: "Notre modèle de développement de l'employabilité des jeunes réunit trois éléments dont les jeunes ont besoin pour passer avec plus d'assurance de l'apprentissage à l'opportunité.",
    },
    steps: [
      {
        stepNumber: "01",
        title: { en: "Learn", fr: "Apprendre" },
        subtitle: {
          en: "Build capabilities for work",
          fr: "Développer des compétences pour le travail",
        },
        description: {
          en: "Through experiential learning, young people strengthen communication, problem-solving, teamwork, self-leadership, digital fluency and other durable skills needed to navigate a changing world of work.",
          fr: "Grâce à l'apprentissage par l'expérience, les jeunes renforcent leur communication, leur résolution de problèmes, leur travail d'équipe, leur autonomie, leur aisance numérique et d'autres compétences durables nécessaires pour évoluer dans un monde du travail en mutation.",
        },
        image: {
          src: "/images/gallery/gwf-2025-37.jpg",
          alt: {
            en: "Two fellows smiling as they take notes together at a table",
            fr: "Deux fellows souriantes prenant des notes ensemble à une table",
          },
        },
      },
      {
        stepNumber: "02",
        title: { en: "Apply", fr: "Appliquer" },
        subtitle: {
          en: "Turn learning into experience",
          fr: "Transformer l'apprentissage en expérience",
        },
        description: {
          en: "Projects, simulations and real-world challenges give young people opportunities to practise what they learn, solve problems and demonstrate what they can do.",
          fr: "Des projets, des simulations et des défis concrets donnent aux jeunes l'occasion de mettre en pratique ce qu'ils apprennent, de résoudre des problèmes et de démontrer ce dont ils sont capables.",
        },
        image: {
          src: "/images/gallery/nsai-heroes-51.jpg",
          alt: {
            en: "Two pupils examining a small robot car they are working on",
            fr: "Deux élèves examinant une petite voiture robot sur laquelle elles travaillent",
          },
        },
      },
      {
        stepNumber: "03",
        title: { en: "Connect", fr: "Connecter" },
        subtitle: {
          en: "Build pathways to opportunity",
          fr: "Construire des chemins vers l'opportunité",
        },
        description: {
          en: "Mentorship, career guidance, professional networks and exposure to opportunities help young people navigate their next steps and build relationships that support their progression.",
          fr: "Le mentorat, l'orientation professionnelle, les réseaux professionnels et l'exposition aux opportunités aident les jeunes à préparer leurs prochaines étapes et à nouer des relations qui soutiennent leur progression.",
        },
        image: {
          src: "/images/gallery/gwf-2026-35.jpg",
          alt: {
            en: "Two fellows in discussion, one gesturing as he explains an idea",
            fr: "Deux fellows en discussion, l'un gesticulant pour expliquer une idée",
          },
        },
      },
    ],
    closingLine: {
      en: "Together, these experiences create a stronger bridge between education and meaningful work.",
      fr: "Ensemble, ces expériences créent une passerelle plus solide entre l'éducation et un travail porteur de sens.",
    },
  },

  ourPrinciples: {
    eyebrow: { en: "Our Principles", fr: "Nos principes" },
    headline: {
      en: "How we build matters.",
      fr: "Notre manière de construire compte.",
    },
    principles: [
      {
        title: { en: "Youth at the centre", fr: "Les jeunes au centre" },
        description: {
          en: "We listen to young people, involve them in the learning process and design around the realities they face.",
          fr: "Nous écoutons les jeunes, les impliquons dans le processus d'apprentissage et concevons nos programmes autour des réalités auxquelles ils font face.",
        },
      },
      {
        title: { en: "Learning by doing", fr: "Apprendre en faisant" },
        description: {
          en: "We believe capability develops through practice, feedback, reflection and real-world application.",
          fr: "Nous croyons que les compétences se développent par la pratique, le retour d'expérience, la réflexion et l'application concrète.",
        },
      },
      {
        title: { en: "Access with equity", fr: "Un accès équitable" },
        description: {
          en: "Opportunity should not depend only on where someone comes from, who they know or what they can afford. We work to widen access for young people who have historically had fewer opportunities.",
          fr: "L'opportunité ne devrait pas dépendre uniquement de ses origines, de ses relations ou de ses moyens. Nous œuvrons à élargir l'accès pour les jeunes qui ont historiquement eu moins d'opportunités.",
        },
      },
      {
        title: { en: "Outcomes that matter", fr: "Des résultats qui comptent" },
        description: {
          en: "Participation is only the beginning. We care about whether young people become more capable, more connected and better positioned to progress into meaningful opportunities.",
          fr: "La participation n'est qu'un début. Ce qui nous importe, c'est de savoir si les jeunes deviennent plus compétents, mieux connectés et mieux placés pour accéder à des opportunités porteuses de sens.",
        },
      },
    ],
    image: { src: PHOTO.fellowshipGroup, alt: GROUP_PHOTO_ALT },
  },

  partnership: {
    eyebrow: { en: "Partnership", fr: "Partenariat" },
    headline: {
      en: "Stronger pathways to work are built together.",
      fr: "Des passerelles plus solides vers l'emploi se construisent ensemble.",
    },
    intro: {
      en: "We collaborate with funders, development organisations, employers, education institutions, mentors and other partners to expand access to skills, experience and meaningful opportunities for young people.",
      fr: "Nous collaborons avec des financeurs, des organisations de développement, des employeurs, des institutions éducatives, des mentors et d'autres partenaires pour élargir l'accès des jeunes aux compétences, à l'expérience et à des opportunités porteuses de sens.",
    },
    // Ordered as the `partnerLogo` documents are in Sanity today.
    logos: [
      {
        name: "Canva for Nonprofits",
        logoUrl: `${CDN}/f7c3eedf8d43e00299b92a873e008474d416dfd3-1212x1212.png`,
      },
      {
        name: "European Union",
        logoUrl: `${CDN}/e6f0743cb701fcfa7b9d37fc0fe03b72c26c309c-4247x891.png`,
      },
      {
        name: "Global Youth Mobilization",
        logoUrl: `${CDN}/065752634b0d84a1ab34dce30f7aa1327c096457-450x138.png`,
      },
      {
        name: "Global Changemakers",
        logoUrl: `${CDN}/e819c03ba7a389393ed703ac2f41b7811b86f483-960x490.png`,
      },
      {
        name: "Kofi Annan Changemakers",
        logoUrl: `${CDN}/c3dc87ed61f34e29b4d515397058580ee074028a-1669x449.jpg`,
      },
      {
        name: "One Young World",
        logoUrl: `${CDN}/21bfe86aa103f03c90c3c2158b68facb22c729b6-1529x524.png`,
      },
      {
        name: "Melton Foundation",
        logoUrl: `${CDN}/be9a001c5f1ff5ec906d393e316cedeb41455fad-427x118.png`,
      },
      {
        name: "Peace First",
        logoUrl: `${CDN}/e4e620326769b6c16153ad0c8767a5931bd343a6-475x185.png`,
      },
      {
        name: "Google for Nonprofits",
        logoUrl: `${CDN}/7ed34c268946bbcad68aa84f9597a38133cfacb7-1280x720.jpg`,
      },
      {
        name: "monday.com for Nonprofits",
        logoUrl: `${CDN}/411c86c0d117a9ef3d6a1d084d7d06f0af8fccc2-1659x252.png`,
      },
    ],
    ctaHeadline: {
      en: "Help us build what comes next.",
      fr: "Aidez-nous à construire la suite.",
    },
    ctaParagraph: {
      en: "Whether through funding, mentorship, workplace exposure, programme partnerships or access to opportunity, there are many ways to help more young people move from education into meaningful work.",
      fr: "Que ce soit par le financement, le mentorat, l'exposition au milieu professionnel, des partenariats de programme ou l'accès aux opportunités, il existe de nombreuses façons d'aider davantage de jeunes à passer de l'éducation à un travail porteur de sens.",
    },
    cta: {
      label: { en: "Partner with us", fr: "Devenir partenaire" },
      href: "/work-with-us",
    },
  },
};
