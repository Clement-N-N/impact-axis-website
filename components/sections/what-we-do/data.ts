import type { WhatWeDoPageContent } from "./types";

// TODO: the French throughout this file is a first-pass translation and needs
// native review before launch, matching the note already on `blog-body/data.ts`.
export const whatWeDoPageContent: WhatWeDoPageContent = {
  hero: {
    eyebrow: { en: "Our Work", fr: "Notre travail" },
    headline: {
      en: "Helping young people move from learning to meaningful work.",
      fr: "Aider les jeunes à passer de l'apprentissage à un travail porteur de sens.",
    },
    paragraphs: [
      {
        en: "Impact Axis designs and delivers youth workforce development programmes in Cameroon that help young people build practical skills, gain real-world experience and develop the connections needed to navigate a changing world of work.",
        fr: "Impact Axis conçoit et met en œuvre au Cameroun des programmes de développement de l'employabilité des jeunes, qui les aident à acquérir des compétences pratiques, une expérience concrète et les relations nécessaires pour évoluer dans un monde du travail en mutation.",
      },
      {
        en: "Our work spans employability development, applied learning, mentorship, career readiness and access to opportunity.",
        fr: "Notre travail couvre le développement de l'employabilité, l'apprentissage appliqué, le mentorat, la préparation à la carrière et l'accès aux opportunités.",
      },
    ],
    cta: {
      label: { en: "Explore our programmes", fr: "Découvrir nos programmes" },
      href: "#programmes",
    },
  },

  focus: {
    eyebrow: { en: "Our Focus", fr: "Notre approche" },
    headline: {
      en: "Building what young people need to navigate work.",
      fr: "Développer ce dont les jeunes ont besoin pour évoluer dans le monde du travail.",
    },
    intro: {
      en: "Rather than treating employability as a single skill-building challenge, our programmes address several factors that shape how young people prepare for and transition into the world of work.",
      fr: "Plutôt que de réduire l'employabilité au seul développement de compétences, nos programmes agissent sur plusieurs facteurs qui déterminent la manière dont les jeunes se préparent au monde du travail et y accèdent.",
    },
    areas: [
      {
        title: {
          en: "Employability & Durable Skills",
          fr: "Employabilité et compétences durables",
        },
        lead: {
          en: "Building capabilities that travel with you",
          fr: "Développer des compétences qui vous suivent partout",
        },
        description: {
          en: "Communication, critical thinking, problem-solving, collaboration, self-leadership and adaptability help young people perform across different roles, industries and stages of their careers.",
          fr: "La communication, l'esprit critique, la résolution de problèmes, la collaboration, le leadership personnel et l'adaptabilité permettent aux jeunes de réussir dans différents postes, secteurs et étapes de carrière.",
        },
      },
      {
        title: {
          en: "Applied Learning & Career Readiness",
          fr: "Apprentissage appliqué et préparation à la carrière",
        },
        lead: {
          en: "Turning knowledge into experience",
          fr: "Transformer les connaissances en expérience",
        },
        description: {
          en: "Projects, simulations and practical challenges give young people opportunities to apply what they know, receive feedback and build confidence navigating professional environments.",
          fr: "Des projets, des simulations et des mises en situation donnent aux jeunes l'occasion d'appliquer leurs connaissances, de recevoir des retours et de gagner en assurance dans un cadre professionnel.",
        },
      },
      {
        title: {
          en: "Mentorship & Professional Networks",
          fr: "Mentorat et réseaux professionnels",
        },
        lead: {
          en: "Making guidance and relationships more accessible",
          fr: "Rendre l'accompagnement et les relations plus accessibles",
        },
        description: {
          en: "Mentorship, career guidance and professional networks help young people make informed decisions, understand their options and build relationships that can open pathways to opportunity.",
          fr: "Le mentorat, l'orientation professionnelle et les réseaux aident les jeunes à décider en connaissance de cause, à comprendre leurs options et à nouer des relations qui ouvrent des portes.",
        },
      },
      {
        title: {
          en: "Digital & AI Readiness",
          fr: "Préparation au numérique et à l'IA",
        },
        lead: {
          en: "Preparing for a changing world of work",
          fr: "Se préparer à un monde du travail en mutation",
        },
        description: {
          en: "Practical digital and AI capabilities help young people use emerging technologies responsibly, work more effectively and remain adaptable as workplaces evolve.",
          fr: "Des compétences numériques et en IA concrètes permettent aux jeunes d'utiliser les technologies émergentes de façon responsable, de travailler plus efficacement et de rester adaptables.",
        },
      },
    ],
    image: {
      src: "/images/alumni-3.png",
      alt: {
        en: "Participants working together during an Impact Axis session",
        fr: "Des participants travaillant ensemble lors d'une session Impact Axis",
      },
    },
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
      },
      {
        title: { en: "Practical", fr: "Pratique" },
        description: {
          en: "Activities are designed around real decisions, challenges and professional contexts.",
          fr: "Les activités sont conçues autour de décisions, de défis et de contextes professionnels réels.",
        },
      },
      {
        title: { en: "Outcome-focused", fr: "Orienté résultats" },
        description: {
          en: "We increasingly track what young people can do and access after participating.",
          fr: "Nous suivons de plus en plus ce que les jeunes savent faire et ce à quoi ils accèdent après leur participation.",
        },
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
    images: [
      {
        src: "/images/alumni-6.png",
        alt: {
          en: "Participants presenting their work",
          fr: "Des participants présentant leur travail",
        },
      },
      {
        src: "/images/girls-1.jpg",
        alt: {
          en: "A group challenge in progress",
          fr: "Un défi de groupe en cours",
        },
      },
      {
        src: "/images/team-1.jpg",
        alt: {
          en: "A mentoring conversation",
          fr: "Une conversation de mentorat",
        },
      },
      {
        src: "/images/collage-image-1.png",
        alt: {
          en: "Moments from Impact Axis workshops",
          fr: "Moments des ateliers Impact Axis",
        },
      },
    ],
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
