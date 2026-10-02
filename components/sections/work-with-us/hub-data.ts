import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { PartnershipAudience } from "@/components/sections/partnership/types";

/** Copy and photos for the redesigned Work With Us hub. */

export type HubAudienceCard = {
  audience: PartnershipAudience;
  label: LocalizedText;
  promise: LocalizedText;
  line: LocalizedText;
  tags: LocalizedText[];
  image: string;
};

export type HubExample = {
  audience: PartnershipAudience;
  label: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  image: string;
};

export const hubContent = {
  hero: {
    eyebrow: { en: "Work with us", fr: "Travailler avec nous" },
    headline: {
      en: "Put Cameroon's young talent to work.",
      fr: "Mettons les jeunes talents du Cameroun au travail.",
    },
    intro: {
      en: "Fund it, hire it, teach it or mentor it. Choose how you'd help, and we'll build the partnership around the result you want.",
      fr: "Financez, recrutez, formez ou accompagnez. Choisissez comment vous souhaitez aider, et nous bâtirons le partenariat autour du résultat que vous visez.",
    },
    pick: { en: "Choose your path", fr: "Choisissez votre voie" },
  },
  cards: [
    {
      audience: "funders-development-partners",
      label: { en: "For funders", fr: "Pour les financeurs" },
      promise: {
        en: "Fund results you can report.",
        fr: "Financez des résultats mesurables.",
      },
      line: {
        en: "Back cohorts, new communities and research.",
        fr: "Soutenez des promotions, de nouvelles communautés et la recherche.",
      },
      tags: [
        { en: "Cohorts", fr: "Promotions" },
        { en: "Expansion", fr: "Expansion" },
        { en: "Research", fr: "Recherche" },
      ],
      image: "/images/partners/funders-handshake.jpg",
    },
    {
      audience: "employers-corporate-partners",
      label: { en: "For employers", fr: "Pour les employeurs" },
      promise: {
        en: "Meet your future hires early.",
        fr: "Rencontrez vos futures recrues plus tôt.",
      },
      line: {
        en: "Internships, mentoring and real projects.",
        fr: "Stages, mentorat et projets concrets.",
      },
      tags: [
        { en: "Internships", fr: "Stages" },
        { en: "Projects", fr: "Projets" },
        { en: "Mentoring", fr: "Mentorat" },
      ],
      image: "/images/partners/employers-interview.jpg",
    },
    {
      audience: "education-training-institutions",
      label: { en: "For educators", fr: "Pour les établissements" },
      promise: {
        en: "Send students into work ready.",
        fr: "Préparez vos étudiants au monde du travail.",
      },
      line: {
        en: "Workshops and career readiness on campus.",
        fr: "Ateliers et préparation à la carrière sur le campus.",
      },
      tags: [
        { en: "Workshops", fr: "Ateliers" },
        { en: "Projects", fr: "Projets" },
        { en: "Mentors", fr: "Mentors" },
      ],
      image: "/images/partners/education-campus.jpg",
    },
    {
      audience: "mentors-professionals",
      label: { en: "For mentors", fr: "Pour les mentors" },
      promise: {
        en: "Turn your experience into someone's head start.",
        fr: "Faites de votre expérience l'élan de quelqu'un.",
      },
      line: {
        en: "Two hours a week can change a career.",
        fr: "Deux heures par semaine peuvent changer une carrière.",
      },
      tags: [
        { en: "Mentoring", fr: "Mentorat" },
        { en: "Talks", fr: "Interventions" },
        { en: "Feedback", fr: "Retours" },
      ],
      image: "/images/partners/mentors-conversation.jpg",
    },
  ] satisfies HubAudienceCard[],
  proof: {
    eyebrow: { en: "Our track record", fr: "Notre bilan" },
    headline: {
      en: "What we've done so far.",
      fr: "Ce que nous avons accompli jusqu'ici.",
    },
    logos: {
      en: "Alongside partners like",
      fr: "Aux côtés de partenaires comme",
    },
  },
  steps: {
    eyebrow: { en: "How we partner", fr: "Comment nous collaborons" },
    headline: {
      en: "You bring the goal. We build the path.",
      fr: "Vous apportez l'objectif. Nous traçons le chemin.",
    },
    items: [
      {
        title: { en: "Understand", fr: "Comprendre" },
        body: {
          en: "Who we want to reach, what's in their way and what success looks like.",
          fr: "Qui nous voulons atteindre, ce qui les freine et à quoi ressemble la réussite.",
        },
      },
      {
        title: { en: "Design", fr: "Concevoir" },
        body: {
          en: "The programme, resources and opportunities to get there.",
          fr: "Le programme, les ressources et les opportunités pour y parvenir.",
        },
      },
      {
        title: { en: "Deliver", fr: "Mettre en œuvre" },
        body: {
          en: "We run it and support every participant.",
          fr: "Nous le mettons en œuvre et accompagnons chaque participant.",
        },
      },
      {
        title: { en: "Learn", fr: "Apprendre" },
        body: {
          en: "We measure what changed and report it back to you.",
          fr: "Nous mesurons ce qui a changé et vous en rendons compte.",
        },
      },
    ],
  },
  examples: {
    eyebrow: { en: "What we could build", fr: "Ce que nous pourrions bâtir" },
    headline: {
      en: "Start with an outcome, not a package.",
      fr: "Partez d'un résultat, pas d'une formule.",
    },
    explore: { en: "Explore", fr: "Découvrir" },
    items: [
      {
        audience: "funders-development-partners",
        label: { en: "Funders", fr: "Financeurs" },
        title: { en: "Sponsor a cohort", fr: "Parrainer une promotion" },
        body: {
          en: "Take a full cohort of young people through the Goodwill Fellowship.",
          fr: "Accompagnez toute une promotion de jeunes dans la Goodwill Fellowship.",
        },
        image: "/images/gallery/gwf-2024-42.jpg",
      },
      {
        audience: "employers-corporate-partners",
        label: { en: "Employers", fr: "Employeurs" },
        title: { en: "Host interns", fr: "Accueillir des stagiaires" },
        body: {
          en: "Give fellows their first real taste of the workplace.",
          fr: "Offrez aux fellows leur première vraie expérience du monde du travail.",
        },
        image: "/images/partners/employers-career-fair.jpg",
      },
      {
        audience: "education-training-institutions",
        label: { en: "Educators", fr: "Établissements" },
        title: {
          en: "Run a campus workshop",
          fr: "Organiser un atelier sur le campus",
        },
        body: {
          en: "Bring practical career readiness to your students.",
          fr: "Apportez une préparation concrète à la carrière à vos étudiants.",
        },
        image: "/images/gallery/gwf-2025-39.jpg",
      },
      {
        audience: "mentors-professionals",
        label: { en: "Mentors", fr: "Mentors" },
        title: { en: "Mentor a fellow", fr: "Accompagner un fellow" },
        body: {
          en: "Two hours a week to guide someone's next step.",
          fr: "Deux heures par semaine pour guider le prochain pas de quelqu'un.",
        },
        image: "/images/gallery/hive-001-28.jpg",
      },
    ] satisfies HubExample[],
  },
  closing: {
    headline: {
      en: "Tell us the change you want to see.",
      fr: "Dites-nous quel changement vous voulez voir.",
    },
    body: {
      en: "We'll reply within two working days and shape the partnership with you from there.",
      fr: "Nous vous répondrons sous deux jours ouvrés et construirons le partenariat avec vous à partir de là.",
    },
    cta: { en: "Start a conversation", fr: "Entamer la conversation" },
    note: {
      en: "No fixed packages. No commitment to talk.",
      fr: "Aucune formule imposée. Aucun engagement pour échanger.",
    },
  },
};

/** Fallback figures for when Sanity can't be reached; Sanity wins when it can. */
export const FALLBACK_STATS = [
  {
    value: "450+",
    label: { en: "young people reached", fr: "jeunes touchés" },
  },
  {
    value: "$1.5M+",
    label: { en: "in opportunities unlocked", fr: "d'opportunités débloquées" },
  },
  {
    value: "65%",
    label: {
      en: "grow their employability skills",
      fr: "renforcent leurs compétences d'employabilité",
    },
  },
  {
    value: "55%",
    label: {
      en: "reach an opportunity within 6 months",
      fr: "accèdent à une opportunité en 6 mois",
    },
  },
  {
    value: "67%",
    label: {
      en: "of our fellows are young women",
      fr: "de nos fellows sont des jeunes femmes",
    },
  },
];
