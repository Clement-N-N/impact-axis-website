import type { WhatWeDoPageContent } from "./types";

// TODO: the French throughout this file is a first-pass translation and needs
// native review before launch, matching the note already on `blog-body/data.ts`.
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
      en: "Where the work comes to life.",
      fr: "Là où le travail prend vie.",
    },
    intro: {
      en: "Our programmes turn these focus areas into structured learning, community and career development experiences for young people.",
      fr: "Nos programmes traduisent ces axes en expériences structurées d'apprentissage, de communauté et de développement de carrière pour les jeunes.",
    },
    programmes: [
      {
        id: "goodwill-fellowship",
        title: { en: "Goodwill Fellowship", fr: "Goodwill Fellowship" },
        tagline: {
          en: "Building skills, relationships and pathways to opportunity.",
          fr: "Développer des compétences, des relations et des chemins vers l'opportunité.",
        },
        description: {
          en: "The Goodwill Fellowship is a four-month employability and youth development programme for young Cameroonians. Fellows strengthen durable skills, gain practical experience, build professional relationships and receive continued support as they navigate opportunities.",
          fr: "Le Goodwill Fellowship est un programme de quatre mois dédié à l'employabilité et au développement des jeunes Camerounais. Les fellows renforcent leurs compétences durables, acquièrent une expérience pratique, tissent des relations professionnelles et bénéficient d'un accompagnement continu.",
        },
        image: {
          src: "/images/alumni-1.jpg",
          alt: {
            en: "Goodwill Fellowship participants during an intensive",
            fr: "Des participants du Goodwill Fellowship pendant un intensif",
          },
        },
      },
      {
        id: "skills-employability-learning",
        title: {
          en: "Skills & Employability Learning",
          fr: "Apprentissage des compétences et de l'employabilité",
        },
        tagline: {
          en: "Practical learning for life beyond the classroom.",
          fr: "Un apprentissage pratique pour la vie au-delà de la salle de classe.",
        },
        description: {
          en: "Our experiential workshops help young people build and practise communication, problem-solving, teamwork, career navigation, digital skills and other capabilities relevant to the world of work.",
          fr: "Nos ateliers expérientiels aident les jeunes à développer et à pratiquer la communication, la résolution de problèmes, le travail d'équipe, l'orientation de carrière, les compétences numériques et d'autres capacités utiles au monde du travail.",
        },
        image: {
          src: "/images/alumni-4.png",
          alt: {
            en: "A skills workshop in progress",
            fr: "Un atelier de compétences en cours",
          },
        },
      },
      {
        id: "the-hive",
        title: { en: "The Hive", fr: "The Hive" },
        tagline: {
          en: "Where young people, ideas and opportunity meet.",
          fr: "Là où les jeunes, les idées et les opportunités se rencontrent.",
        },
        description: {
          en: "The Hive creates spaces for young people to meet peers and professionals, exchange ideas, build meaningful relationships and gain exposure to opportunities beyond their immediate networks.",
          fr: "The Hive crée des espaces où les jeunes rencontrent leurs pairs et des professionnels, échangent des idées, nouent des relations solides et accèdent à des opportunités au-delà de leur réseau immédiat.",
        },
        image: {
          src: "/images/girls-2.jpg",
          alt: {
            en: "Young people connecting at a Hive gathering",
            fr: "Des jeunes échangeant lors d'une rencontre The Hive",
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
