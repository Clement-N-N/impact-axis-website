import type { WhatWeDoPageContent } from "./types";

// TODO: the French throughout this file is a first-pass translation and needs
// native review before launch, flagged for native French review.
export const whatWeDoPageContent: WhatWeDoPageContent = {
  hero: {
    headline: {
      en: "Helping Cameroon’s youth move from learning to meaningful work.",
      fr: "Aider la jeunesse camerounaise à passer de l’apprentissage à un travail porteur de sens.",
    },
    intro: {
      en: "Traditional education leaves youth unprepared for the job market. Impact Axis changes that by delivering demand-driven programmes that empower the next generation.",
      fr: "L’enseignement traditionnel laisse les jeunes mal préparés au marché du travail. Impact Axis change la donne en proposant des programmes adaptés aux besoins réels, qui donnent les moyens d’agir à la prochaine génération.",
    },
    directions: [
      {
        title: { en: "Practical Skills", fr: "Compétences pratiques" },
        body: {
          en: "Equipping young people with demand-driven technical and professional capabilities that classroom theory leaves behind.",
          fr: "Doter les jeunes de compétences techniques et professionnelles recherchées, que la théorie en classe laisse de côté.",
        },
        image: {
          src: "/images/wwd-skills-discussion.jpg",
          alt: {
            en: "A young woman in red glasses and a name sticker explains a point to a peer during an Impact Axis session",
            fr: "Une jeune femme aux lunettes rouges, portant un badge à son nom, explique un point à une camarade lors d’une session Impact Axis",
          },
        },
        imagePosition: "58% 30%",
        href: "#focus",
      },
      {
        title: { en: "Vibrant Community", fr: "Une communauté dynamique" },
        body: {
          en: "Creating a trusted, supportive ecosystem where ambitious peers collaborate, share resources, and grow together.",
          fr: "Créer un écosystème de confiance et de soutien où des pairs ambitieux collaborent, partagent leurs ressources et grandissent ensemble.",
        },
        image: {
          src: "/images/wwd-community-networking.jpg",
          alt: {
            en: "A smiling young man in a white shirt bumps fists with another attendee at a busy networking event",
            fr: "Un jeune homme souriant, en chemise blanche, échange un check avec une autre participante lors d’un événement de networking animé",
          },
        },
        imagePosition: "62% 35%",
        href: "/work-with-us",
      },
      {
        title: { en: "Industry Mentorship", fr: "Mentorat professionnel" },
        body: {
          en: "Connecting talent directly with established professionals to navigate career paths and unlock hidden job markets.",
          fr: "Mettre les talents en relation directe avec des professionnels confirmés pour s’orienter dans leur carrière et accéder au marché caché de l’emploi.",
        },
        image: {
          src: "/images/wwd-mentorship-laptop.jpg",
          alt: {
            en: "A mentor in an Impact Axis T-shirt guides a young woman through something on his laptop",
            fr: "Un mentor en T-shirt Impact Axis guide une jeune femme sur son ordinateur portable",
          },
        },
        imagePosition: "50% 30%",
        href: "#programmes",
      },
    ],
  },

  focus: {
    eyebrow: { en: "Our Focus", fr: "Notre approche" },
    headline: {
      en: "Building what young people need to navigate work.",
      fr: "Développer ce dont les jeunes ont besoin pour évoluer dans le monde du travail.",
    },
    intro: {
      en: "We focus on the skills, experiences, relationships and tools that help young people move from learning into meaningful work.",
      fr: "Nous nous concentrons sur les compétences, les expériences, les relations et les outils qui aident les jeunes à passer de l’apprentissage à un travail porteur de sens.",
    },
    areas: [
      {
        title: {
          en: "Employability & Durable Skills",
          fr: "Employabilité et compétences durables",
        },
        description: {
          en: "Build the capabilities that travel across careers:",
          fr: "Développer des compétences qui vous suivent d’un métier à l’autre :",
        },
        chips: [
          { en: "Communication", fr: "Communication" },
          { en: "Critical thinking", fr: "Esprit critique" },
          { en: "Problem-solving", fr: "Résolution de problèmes" },
          { en: "Collaboration", fr: "Collaboration" },
          { en: "Self-leadership", fr: "Leadership personnel" },
          { en: "Adaptability", fr: "Adaptabilité" },
        ],
        image: {
          src: "/images/focus-durable-skills.jpg",
          alt: {
            en: "A young woman takes notes while talking with a peer at a networking session",
            fr: "Une jeune femme prend des notes en discutant avec un pair lors d’une session de networking",
          },
        },
        imagePosition: "48% 40%",
      },
      {
        title: {
          en: "Applied Learning & Career Readiness",
          fr: "Apprentissage appliqué et préparation à la carrière",
        },
        description: {
          en: "Turn knowledge into experience through real projects, simulations, feedback and practical challenges.",
          fr: "Transformer les connaissances en expérience grâce à des projets concrets, des simulations, des retours et des défis pratiques.",
        },
        image: {
          src: "/images/focus-applied-learning.jpg",
          alt: {
            en: "A smiling participant builds a tower from paper and cups during a hands-on team challenge",
            fr: "Un participant souriant construit une tour en papier et en gobelets lors d’un défi d’équipe pratique",
          },
        },
        imagePosition: "45% 35%",
      },
      {
        title: {
          en: "Mentorship & Professional Networks",
          fr: "Mentorat et réseaux professionnels",
        },
        description: {
          en: "Connect young people to the guidance, relationships and networks that help them make better career decisions and access opportunities.",
          fr: "Relier les jeunes à l’accompagnement, aux relations et aux réseaux qui les aident à mieux orienter leur carrière et à accéder aux opportunités.",
        },
        image: {
          src: "/images/focus-mentorship-networks.jpg",
          alt: {
            en: "A speaker addresses a packed lecture hall of young people at a career event",
            fr: "Un intervenant s’adresse à un amphithéâtre rempli de jeunes lors d’un événement carrière",
          },
        },
        imagePosition: "60% 60%",
      },
      {
        title: {
          en: "Digital & AI Readiness",
          fr: "Préparation au numérique et à l’IA",
        },
        description: {
          en: "Build practical digital and AI skills to work effectively, adapt quickly and thrive as work evolves.",
          fr: "Acquérir des compétences numériques et en IA concrètes pour travailler efficacement, s’adapter vite et réussir dans un monde du travail en évolution.",
        },
        image: {
          src: "/images/focus-digital-ai.jpg",
          alt: {
            en: "Two young people work through something together on a laptop",
            fr: "Deux jeunes travaillent ensemble sur un ordinateur portable",
          },
        },
        imagePosition: "62% 45%",
      },
    ],
  },

  programmes: {
    eyebrow: { en: "Our Programmes", fr: "Nos programmes" },
    headline: {
      en: "How we bring this to life",
      fr: "Comment nous donnons vie à cette approche",
    },
    intro: {
      en: "Our programmes turn skills, networks and career readiness into practical experiences for young people.",
      fr: "Nos programmes transforment les compétences, les réseaux et la préparation à la carrière en expériences concrètes pour les jeunes.",
    },
    programmes: [
      {
        id: "goodwill-fellowship",
        title: { en: "Goodwill Fellowship", fr: "Goodwill Fellowship" },
        tagline: {
          en: "Skills, relationships and pathways to opportunity.",
          fr: "Compétences, relations et passerelles vers les opportunités.",
        },
        description: {
          en: "A four-month programme helping young Cameroonians build durable skills, practical experience and professional networks.",
          fr: "Un programme de quatre mois qui aide les jeunes Camerounais à développer des compétences durables, une expérience pratique et des réseaux professionnels.",
        },
        image: {
          src: "/images/prog-goodwill-fellowship.jpg",
          alt: {
            en: "Goodwill Fellowship participants in black Impact Axis T-shirts posing together in front of the programme banner",
            fr: "Des participants de la Goodwill Fellowship en T-shirts noirs Impact Axis posent ensemble devant la bannière du programme",
          },
        },
      },
      {
        id: "skills-employability-learning",
        title: {
          en: "Skills & Employability Learning",
          fr: "Compétences et employabilité",
        },
        tagline: {
          en: "Practical learning for life beyond the classroom.",
          fr: "Un apprentissage concret pour la vie après l’école.",
        },
        description: {
          en: "Experiential workshops that help young people practise the skills they need to navigate work and opportunity.",
          fr: "Des ateliers expérientiels qui aident les jeunes à pratiquer les compétences dont ils ont besoin pour évoluer dans le monde du travail et saisir les opportunités.",
        },
        image: {
          src: "/images/prog-skills-learning.jpg",
          alt: {
            en: "Two participants work through a worksheet together during a skills workshop",
            fr: "Deux participants remplissent ensemble une fiche lors d’un atelier de compétences",
          },
        },
      },
      {
        id: "the-hive",
        title: { en: "The Hive", fr: "The Hive" },
        tagline: {
          en: "Where young people, ideas and opportunity meet.",
          fr: "Là où se rencontrent les jeunes, les idées et les opportunités.",
        },
        description: {
          en: "Curated spaces for young people to connect, exchange ideas and expand their professional networks.",
          fr: "Des espaces pensés pour que les jeunes se rencontrent, échangent des idées et élargissent leurs réseaux professionnels.",
        },
        image: {
          src: "/images/prog-the-hive-banner.jpg",
          alt: {
            en: "A participant posing beside The Hive banner, one arm raised to the top of it",
            fr: "Une participante posant à côté de la bannière The Hive, un bras levé vers le haut de celle-ci",
          },
        },
      },
    ],
  },

  different: {
    eyebrow: {
      en: "What Makes Our Work Different",
      fr: "Ce qui distingue notre travail",
    },
    headline: {
      en: "We look beyond the training room.",
      fr: "Nous regardons au-delà de la salle de formation.",
    },
    intro: {
      en: "Our goal is not simply to deliver workshops. We design experiences around what young people should be better able to do after participating: apply their skills, navigate professional environments, build relationships and access meaningful opportunities.",
      fr: "Notre objectif n'est pas simplement d'animer des ateliers. Nous concevons des expériences autour de ce que les jeunes doivent être mieux capables de faire ensuite : mobiliser leurs compétences, évoluer en milieu professionnel, nouer des relations et accéder à des opportunités porteuses de sens.",
    },
    traits: [
      {
        title: { en: "Experiential", fr: "Expérientiel" },
        description: {
          en: "Learning happens through doing, feedback and reflection.",
          fr: "L'apprentissage passe par la pratique, les retours et la réflexion.",
        },
        icon: "/icons/experiential.svg",
      },
      {
        title: { en: "Practical", fr: "Pratique" },
        description: {
          en: "Activities are designed around real decisions, challenges and professional contexts.",
          fr: "Les activités sont conçues autour de décisions, de défis et de contextes professionnels réels.",
        },
        icon: "/icons/practical.svg",
      },
      {
        title: { en: "Outcome-focused", fr: "Orienté résultats" },
        description: {
          en: "We increasingly track what young people can do and access after participating.",
          fr: "Nous suivons de plus en plus ce que les jeunes savent faire et ce à quoi ils accèdent après leur participation.",
        },
        icon: "/icons/outcome-focused.svg",
      },
    ],
  },

  workInAction: {
    eyebrow: { en: "Work in Action", fr: "Le travail en action" },
    headline: {
      en: "Learning should look like doing.",
      fr: "Apprendre devrait ressembler à faire.",
    },
    caption: {
      en: "From simulations and team challenges to mentorship and professional conversations, our programmes create spaces where young people can practise, experiment, connect and grow.",
      fr: "Des simulations et défis d'équipe au mentorat et aux échanges professionnels, nos programmes créent des espaces où les jeunes peuvent s'exercer, expérimenter, se connecter et grandir.",
    },
    image: {
      src: "/images/collage-image-1.png",
      alt: { en: "", fr: "" },
    },
    cta: {
      label: { en: "See our stories", fr: "Voir nos histoires" },
      href: "/blog",
    },
  },

  gallery: {
    eyebrow: { en: "Gallery", fr: "Galerie" },
    headline: {
      en: "Moments from our events.",
      fr: "Moments de nos événements.",
    },
    intro: {
      en: "Fellowships, workshops, school visits and hangouts: the young people, volunteers and partners behind Impact Axis, in their element.",
      fr: "Fellowships, ateliers, visites d'écoles et rencontres : les jeunes, les bénévoles et les partenaires d'Impact Axis, dans leur élément.",
    },
    allLabel: { en: "All", fr: "Tout" },
    filterLabel: {
      en: "Filter photos by event",
      fr: "Filtrer les photos par événement",
    },
    lightbox: {
      close: { en: "Close", fr: "Fermer" },
      previous: { en: "Previous photo", fr: "Photo précédente" },
      next: { en: "Next photo", fr: "Photo suivante" },
      counter: { en: "{current} of {total}", fr: "{current} sur {total}" },
    },
    events: [
      { id: "gwf-2026", name: { en: "GWF 2026", fr: "GWF 2026" } },
      { id: "gwf-2025", name: { en: "GWF 2025", fr: "GWF 2025" } },
      { id: "gwf-2024", name: { en: "GWF 2024", fr: "GWF 2024" } },
      { id: "hive-001", name: { en: "The Hive 001", fr: "The Hive 001" } },
      { id: "nsai-heroes", name: { en: "Nsai Heroes", fr: "Nsai Heroes" } },
      {
        id: "volunteers-hangout",
        name: { en: "Volunteers hangout", fr: "Rencontre des bénévoles" },
      },
    ],
    // Order is the "All" view; spans are tuned so the 4-column mosaic packs
    // without holes.
    photos: [
      {
        src: "/images/gallery/gwf-2026-36.jpg",
        alt: {
          en: "A large group of fellows in blue and white GWF t-shirts making peace signs outdoors",
          fr: "Un grand groupe de fellows en t-shirts GWF bleus et blancs faisant le signe de la paix en plein air",
        },
        event: "gwf-2026",
        width: 2000,
        height: 1333,
        span: "big",
      },
      {
        src: "/images/gallery/hive-001-29.jpg",
        alt: {
          en: "A young woman smiling in front of a floral backdrop",
          fr: "Une jeune femme souriante devant un décor floral",
        },
        event: "hive-001",
        width: 1333,
        height: 2000,
        span: "tall",
      },
      {
        src: "/images/gallery/gwf-2025-37.jpg",
        alt: {
          en: "Two fellows smiling as they take notes together at a table",
          fr: "Deux fellows souriantes prenant des notes ensemble à une table",
        },
        event: "gwf-2025",
        width: 2000,
        height: 1253,
      },
      {
        src: "/images/gallery/nsai-heroes-51.jpg",
        alt: {
          en: "Two pupils in orange uniforms examining a small robot car",
          fr: "Deux élèves en uniforme orange examinant une petite voiture robot",
        },
        event: "nsai-heroes",
        width: 2000,
        height: 1090,
      },
      {
        src: "/images/gallery/gwf-2024-43.jpg",
        alt: {
          en: "Six fellows standing shoulder to shoulder and smiling by a sunlit window",
          fr: "Six fellows côte à côte, souriants, près d'une fenêtre ensoleillée",
        },
        event: "gwf-2024",
        width: 2000,
        height: 1183,
        span: "wide",
      },
      {
        src: "/images/gallery/volunteers-hangout-54.jpg",
        alt: {
          en: "Volunteers laughing as they pull together in a team game outdoors",
          fr: "Des bénévoles riant en tirant ensemble lors d'un jeu d'équipe en plein air",
        },
        event: "volunteers-hangout",
        width: 2000,
        height: 1183,
        span: "wide",
      },
      {
        src: "/images/gallery/gwf-2026-32.jpg",
        alt: {
          en: "Two fellows in GWF t-shirts presenting their group's work from a sheet of paper",
          fr: "Deux fellows en t-shirt GWF présentant le travail de leur groupe à partir d'une feuille",
        },
        event: "gwf-2026",
        width: 2000,
        height: 1333,
      },
      {
        src: "/images/gallery/hive-001-27.jpg",
        alt: {
          en: "Two participants sharing a warm hug",
          fr: "Deux participantes partageant une chaleureuse accolade",
        },
        event: "hive-001",
        width: 2000,
        height: 1333,
      },
      {
        src: "/images/gallery/nsai-heroes-48.jpg",
        alt: {
          en: "Pupils in purple uniforms reaching up towards a small drone hovering above them",
          fr: "Des élèves en uniforme violet tendant les mains vers un petit drone en vol",
        },
        event: "nsai-heroes",
        width: 2000,
        height: 1090,
        span: "big",
      },
      {
        src: "/images/gallery/gwf-2025-40.jpg",
        alt: {
          en: "A fellow in a yellow 2025 Goodwill Fellowship t-shirt giving a thumbs up during a negotiation workshop",
          fr: "Une fellow en t-shirt jaune Goodwill Fellowship 2025 levant le pouce pendant un atelier de négociation",
        },
        event: "gwf-2025",
        width: 2000,
        height: 1253,
      },
      {
        src: "/images/gallery/volunteers-hangout-53.jpg",
        alt: {
          en: "A volunteer holding a phone to her forehead during a guessing game",
          fr: "Une bénévole tenant un téléphone sur son front pendant un jeu de devinettes",
        },
        event: "volunteers-hangout",
        width: 1333,
        height: 1850,
        span: "tall",
      },
      {
        src: "/images/gallery/gwf-2024-45.jpg",
        alt: {
          en: "Two fellows hugging while a friend beside them smiles",
          fr: "Deux fellows s'enlaçant tandis qu'une amie sourit à côté",
        },
        event: "gwf-2024",
        width: 2000,
        height: 1183,
      },
      {
        src: "/images/gallery/hive-001-28.jpg",
        alt: {
          en: "A black-and-white photo of two participants deep in conversation",
          fr: "Une photo en noir et blanc de deux participants en pleine conversation",
        },
        event: "hive-001",
        width: 2000,
        height: 1333,
      },
      {
        src: "/images/gallery/gwf-2026-33.jpg",
        alt: {
          en: "A group of seven fellows wearing name tags and smiling indoors",
          fr: "Un groupe de sept fellows portant des badges et souriant à l'intérieur",
        },
        event: "gwf-2026",
        width: 2000,
        height: 1333,
        span: "wide",
      },
      {
        src: "/images/gallery/gwf-2025-41.jpg",
        alt: {
          en: "The 2025 Goodwill Fellowship cohort in yellow t-shirts posing in front of the event banner",
          fr: "La promotion 2025 de la Goodwill Fellowship en t-shirts jaunes posant devant la bannière de l'événement",
        },
        event: "gwf-2025",
        width: 2000,
        height: 1253,
        span: "big",
      },
      {
        src: "/images/gallery/nsai-heroes-47.jpg",
        alt: {
          en: "A pupil holding up a solar water device built from a bottle and a wooden box",
          fr: "Un élève montrant un dispositif solaire fabriqué avec une bouteille et une boîte en bois",
        },
        event: "nsai-heroes",
        width: 1333,
        height: 1755,
        span: "tall",
      },
      {
        src: "/images/gallery/gwf-2024-44.jpg",
        alt: {
          en: "Two fellows wearing name tags walking past the Goodwill Fellowship banner",
          fr: "Deux fellows portant des badges passant devant la bannière de la Goodwill Fellowship",
        },
        event: "gwf-2024",
        width: 2000,
        height: 1183,
      },
      {
        src: "/images/gallery/hive-001-30.jpg",
        alt: {
          en: "Participants in a group discussion outdoors among palm trees",
          fr: "Des participants en discussion de groupe en plein air, parmi les palmiers",
        },
        event: "hive-001",
        width: 2000,
        height: 1333,
        span: "wide",
      },
      {
        src: "/images/gallery/gwf-2026-35.jpg",
        alt: {
          en: "Two fellows in discussion, one gesturing as he explains an idea",
          fr: "Deux fellows en discussion, l'un gesticulant pour expliquer une idée",
        },
        event: "gwf-2026",
        width: 2000,
        height: 1333,
      },
      {
        src: "/images/gallery/volunteers-hangout-52.jpg",
        alt: {
          en: "Two volunteers in conversation, one explaining with open hands",
          fr: "Deux bénévoles en conversation, l'un expliquant les mains ouvertes",
        },
        event: "volunteers-hangout",
        width: 2000,
        height: 1333,
        span: "wide",
      },
      {
        src: "/images/gallery/gwf-2024-42.jpg",
        alt: {
          en: "The 2024 Goodwill Fellowship cohort in blue t-shirts making peace signs",
          fr: "La promotion 2024 de la Goodwill Fellowship en t-shirts bleus faisant le signe de la paix",
        },
        event: "gwf-2024",
        width: 2000,
        height: 1099,
        span: "big",
      },
      {
        src: "/images/gallery/nsai-heroes-49.jpg",
        alt: {
          en: "Two pupils wiring a solar device together at their desk",
          fr: "Deux élèves câblant ensemble un dispositif solaire à leur table",
        },
        event: "nsai-heroes",
        width: 2000,
        height: 1090,
      },
      {
        src: "/images/gallery/gwf-2025-39.jpg",
        alt: {
          en: "Fellows in yellow t-shirts planning together around a table covered in sticky notes",
          fr: "Des fellows en t-shirts jaunes planifiant ensemble autour d'une table couverte de post-it",
        },
        event: "gwf-2025",
        width: 2000,
        height: 1253,
      },
      {
        src: "/images/gallery/hive-001-31.jpg",
        alt: {
          en: "Two young women smiling together in purple light",
          fr: "Deux jeunes femmes souriant ensemble sous une lumière violette",
        },
        event: "hive-001",
        width: 1333,
        height: 2000,
        span: "tall",
      },
      {
        src: "/images/gallery/gwf-2026-34.jpg",
        alt: {
          en: "Two fellows smiling inside a Grow, Connect, Thrive photo frame",
          fr: "Deux fellows souriant dans un cadre photo « Grow, Connect, Thrive »",
        },
        event: "gwf-2026",
        width: 2000,
        height: 1333,
      },
      {
        src: "/images/gallery/nsai-heroes-50.jpg",
        alt: {
          en: "A classroom of pupils in orange uniforms listening attentively",
          fr: "Une classe d'élèves en uniforme orange écoutant attentivement",
        },
        event: "nsai-heroes",
        width: 2000,
        height: 1090,
        span: "wide",
      },
      {
        src: "/images/gallery/gwf-2025-38.jpg",
        alt: {
          en: "Fellows in white t-shirts posing with an Impact Axis social media photo frame",
          fr: "Des fellows en t-shirts blancs posant avec un cadre photo Impact Axis façon réseaux sociaux",
        },
        event: "gwf-2025",
        width: 2000,
        height: 1253,
        span: "wide",
      },
      {
        src: "/images/gallery/gwf-2024-46.jpg",
        alt: {
          en: "A fellow laughing in conversation with a friend",
          fr: "Un fellow riant en pleine conversation avec une amie",
        },
        event: "gwf-2024",
        width: 2000,
        height: 1183,
        span: "wide",
      },
    ],
  },

  closing: {
    headline: {
      en: "Find your place in our work.",
      fr: "Trouvez votre place dans notre travail.",
    },
    cards: [
      {
        title: { en: "For Young People", fr: "Pour les jeunes" },
        description: {
          en: "Explore programmes designed to help you build skills, experience and connections.",
          fr: "Découvrez des programmes conçus pour vous aider à développer vos compétences, votre expérience et votre réseau.",
        },
        cta: {
          label: { en: "Explore programmes", fr: "Découvrir les programmes" },
          href: "#programmes",
        },
      },
      {
        title: { en: "For Organisations", fr: "Pour les organisations" },
        description: {
          en: "Discover how your organisation can help expand pathways to meaningful work for young people.",
          fr: "Découvrez comment votre organisation peut élargir les chemins vers un travail porteur de sens pour les jeunes.",
        },
        cta: {
          label: { en: "Work with us", fr: "Travailler avec nous" },
          href: "/work-with-us",
        },
      },
    ],
  },
};
