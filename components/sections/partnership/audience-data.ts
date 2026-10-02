import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { PartnershipAudience } from "./types";

/** Copy, photos and options for the redesigned audience pages. */

export type AudienceOption = { title: LocalizedText; body: LocalizedText };

export type AudiencePage = {
  label: LocalizedText;
  headline: LocalizedText;
  intro: LocalizedText;
  cta: LocalizedText;
  image: { src: string; alt: LocalizedText };
  /** Pinned on the hero photo. */
  badge: { value: string; label: LocalizedText };
  optionsHeadline: LocalizedText;
  options: AudienceOption[];
  getHeadline: LocalizedText;
  gets: LocalizedText[];
  formHeadline: LocalizedText;
};

export const audienceShared = {
  crumb: { en: "Work with us", fr: "Travailler avec nous" },
  optionsEyebrow: { en: "Ways to partner", fr: "Façons de collaborer" },
  getEyebrow: { en: "What you get", fr: "Ce que vous obtenez" },
  formEyebrow: { en: "Get in touch", fr: "Contact" },
  reply: {
    en: "We'll reply within two working days.",
    fr: "Nous vous répondrons sous deux jours ouvrés.",
  },
  impact: { en: "See our impact", fr: "Voir notre impact" },
  also: { en: "Also partnering as…", fr: "Vous êtes plutôt…" },
};

export const audiencePages: Record<PartnershipAudience, AudiencePage> = {
  "funders-development-partners": {
    label: {
      en: "For funders & development partners",
      fr: "Pour les financeurs et partenaires de développement",
    },
    headline: {
      en: "Fund results you can report to your board.",
      fr: "Financez des résultats que vous pourrez présenter à votre conseil.",
    },
    intro: {
      en: "Back youth workforce programmes in Cameroon built around measurable change: skills gained, experience earned, opportunities reached.",
      fr: "Soutenez des programmes d'employabilité des jeunes au Cameroun fondés sur un changement mesurable : compétences acquises, expérience gagnée, opportunités atteintes.",
    },
    cta: {
      en: "Discuss a funding partnership",
      fr: "Discuter d'un financement",
    },
    image: {
      src: "/images/gallery/gwf-2025-41.jpg",
      alt: {
        en: "The 2025 Goodwill Fellowship cohort in yellow t-shirts in front of the event banner",
        fr: "La promotion 2025 de la Goodwill Fellowship en t-shirts jaunes devant la bannière de l'événement",
      },
    },
    badge: {
      value: "$1.5M+",
      label: {
        en: "in opportunities unlocked",
        fr: "d'opportunités débloquées",
      },
    },
    optionsHeadline: {
      en: "Choose where your funding goes.",
      fr: "Choisissez où va votre financement.",
    },
    options: [
      {
        title: { en: "Sponsor a cohort", fr: "Parrainer une promotion" },
        body: {
          en: "Take a full cohort through the fellowship, from skills to placement.",
          fr: "Accompagnez une promotion entière, des compétences jusqu'au placement.",
        },
      },
      {
        title: {
          en: "Reach a new community",
          fr: "Atteindre une nouvelle communauté",
        },
        body: {
          en: "Bring a proven programme to an underserved region.",
          fr: "Déployez un programme éprouvé dans une région mal desservie.",
        },
      },
      {
        title: { en: "Digital & AI readiness", fr: "Numérique et IA" },
        body: {
          en: "Prepare young people for the jobs that are coming.",
          fr: "Préparez les jeunes aux métiers de demain.",
        },
      },
      {
        title: { en: "Research & measurement", fr: "Recherche et mesure" },
        body: {
          en: "Strengthen the evidence on youth employment outcomes.",
          fr: "Renforcez les données sur les résultats en matière d'emploi des jeunes.",
        },
      },
    ],
    getHeadline: {
      en: "Evidence you can stand behind.",
      fr: "Des preuves solides.",
    },
    gets: [
      {
        en: "Clear outcomes agreed with you from day one",
        fr: "Des résultats clairs définis avec vous dès le départ",
      },
      {
        en: "Regular updates on reach, skills and placements",
        fr: "Des points réguliers sur la portée, les compétences et les placements",
      },
      {
        en: "Stories and data you can share with your board",
        fr: "Des récits et des données à partager avec votre conseil",
      },
    ],
    formHeadline: {
      en: "Tell us what you'd like to fund.",
      fr: "Dites-nous ce que vous aimeriez financer.",
    },
  },

  "employers-corporate-partners": {
    label: {
      en: "For employers & corporate partners",
      fr: "Pour les employeurs et entreprises",
    },
    headline: {
      en: "Meet your future hires before you hire them.",
      fr: "Rencontrez vos futures recrues avant de les recruter.",
    },
    intro: {
      en: "Host interns, mentor fellows or set a real project, and build a pipeline of job-ready young talent in Cameroon.",
      fr: "Accueillez des stagiaires, accompagnez des fellows ou confiez un vrai projet, et constituez un vivier de jeunes talents prêts à travailler au Cameroun.",
    },
    cta: {
      en: "Start building your talent pipeline",
      fr: "Construire votre vivier de talents",
    },
    image: {
      src: "/images/gallery/gwf-2026-35.jpg",
      alt: {
        en: "Two fellows in discussion, one gesturing as he explains an idea",
        fr: "Deux fellows en discussion, l'un gesticulant pour expliquer une idée",
      },
    },
    badge: {
      value: "55%",
      label: {
        en: "reach an opportunity within 6 months",
        fr: "accèdent à une opportunité en 6 mois",
      },
    },
    optionsHeadline: {
      en: "Bring the workplace to young people.",
      fr: "Rapprochez le monde du travail des jeunes.",
    },
    options: [
      {
        title: { en: "Host interns", fr: "Accueillir des stagiaires" },
        body: {
          en: "Give fellows their first real taste of your workplace.",
          fr: "Offrez aux fellows leur première vraie expérience chez vous.",
        },
      },
      {
        title: { en: "Set a real project", fr: "Confier un vrai projet" },
        body: {
          en: "A business challenge fellows solve in teams.",
          fr: "Un défi d'entreprise que les fellows relèvent en équipe.",
        },
      },
      {
        title: {
          en: "Mentor through your team",
          fr: "Mentorat par vos équipes",
        },
        body: {
          en: "Your people guide fellows through their first steps.",
          fr: "Vos collaborateurs guident les fellows dans leurs premiers pas.",
        },
      },
      {
        title: { en: "Career conversations", fr: "Échanges carrière" },
        body: {
          en: "Show young people what work in your field looks like.",
          fr: "Montrez aux jeunes à quoi ressemble le travail dans votre secteur.",
        },
      },
    ],
    getHeadline: {
      en: "Talent you helped shape.",
      fr: "Des talents que vous avez contribué à former.",
    },
    gets: [
      {
        en: "Early access to motivated, job-ready young people",
        fr: "Un accès privilégié à des jeunes motivés et prêts à travailler",
      },
      {
        en: "Fresh perspectives on real business problems",
        fr: "Un regard neuf sur de vrais défis d'entreprise",
      },
      {
        en: "Meaningful engagement for your employees",
        fr: "Un engagement porteur de sens pour vos collaborateurs",
      },
    ],
    formHeadline: {
      en: "Tell us about the roles you hire for.",
      fr: "Parlez-nous des postes que vous recrutez.",
    },
  },

  "education-training-institutions": {
    label: {
      en: "For education & training institutions",
      fr: "Pour les établissements d'enseignement et de formation",
    },
    headline: {
      en: "Help your students leave with more than a degree.",
      fr: "Aidez vos étudiants à partir avec plus qu'un diplôme.",
    },
    intro: {
      en: "Add practical workshops, real projects and professional mentors to your programmes, so graduates step into work ready.",
      fr: "Ajoutez des ateliers pratiques, de vrais projets et des mentors professionnels à vos programmes, pour que vos diplômés soient prêts à travailler.",
    },
    cta: {
      en: "Bring Impact Axis to your campus",
      fr: "Accueillir Impact Axis sur votre campus",
    },
    image: {
      src: "/images/gallery/nsai-heroes-50.jpg",
      alt: {
        en: "A classroom of pupils in orange uniforms listening attentively",
        fr: "Une classe d'élèves en uniforme orange écoutant attentivement",
      },
    },
    badge: {
      value: "65%",
      label: {
        en: "grow their employability skills",
        fr: "renforcent leurs compétences d'employabilité",
      },
    },
    optionsHeadline: {
      en: "What we can bring to your campus.",
      fr: "Ce que nous pouvons apporter à votre campus.",
    },
    options: [
      {
        title: { en: "Experiential workshops", fr: "Ateliers expérientiels" },
        body: {
          en: "Hands-on sessions on communication, teamwork and problem-solving.",
          fr: "Des sessions pratiques sur la communication, le travail d'équipe et la résolution de problèmes.",
        },
      },
      {
        title: { en: "Applied projects", fr: "Projets appliqués" },
        body: {
          en: "Real challenges that let students practise what they learn.",
          fr: "De vrais défis pour mettre en pratique ce qu'ils apprennent.",
        },
      },
      {
        title: {
          en: "Professional exposure",
          fr: "Exposition professionnelle",
        },
        body: {
          en: "Visits, talks and contact with employers.",
          fr: "Visites, interventions et rencontres avec des employeurs.",
        },
      },
      {
        title: { en: "Mentoring", fr: "Mentorat" },
        body: {
          en: "Professionals who guide students into their first role.",
          fr: "Des professionnels qui guident les étudiants vers leur premier poste.",
        },
      },
    ],
    getHeadline: {
      en: "Students ready for what comes next.",
      fr: "Des étudiants prêts pour la suite.",
    },
    gets: [
      {
        en: "Career readiness that complements your curriculum",
        fr: "Une préparation à la carrière qui complète vos enseignements",
      },
      {
        en: "Stronger links between your students and employers",
        fr: "Des liens plus forts entre vos étudiants et les employeurs",
      },
      {
        en: "Graduates better prepared for their first job",
        fr: "Des diplômés mieux préparés à leur premier emploi",
      },
    ],
    formHeadline: {
      en: "Tell us about your students.",
      fr: "Parlez-nous de vos étudiants.",
    },
  },

  "mentors-professionals": {
    label: {
      en: "For mentors & professionals",
      fr: "Pour les mentors et professionnels",
    },
    headline: {
      en: "Your experience could be someone's shortcut.",
      fr: "Votre expérience peut être un raccourci pour quelqu'un.",
    },
    intro: {
      en: "Two hours a week. Mentor a fellow, lead a session or open a door for a young person starting out in Cameroon.",
      fr: "Deux heures par semaine. Accompagnez un fellow, animez une session ou ouvrez une porte à un jeune qui débute au Cameroun.",
    },
    cta: { en: "Become a mentor", fr: "Devenir mentor" },
    image: {
      src: "/images/gallery/gwf-2025-37.jpg",
      alt: {
        en: "Two fellows smiling as they take notes together at a table",
        fr: "Deux fellows souriantes prenant des notes ensemble à une table",
      },
    },
    badge: {
      value: "2 hrs",
      label: { en: "a week is all it takes", fr: "par semaine suffisent" },
    },
    optionsHeadline: {
      en: "Give in the way that suits you.",
      fr: "Donnez de la manière qui vous convient.",
    },
    options: [
      {
        title: { en: "Mentor a fellow", fr: "Accompagner un fellow" },
        body: {
          en: "Guide one young person through the fellowship.",
          fr: "Guidez un jeune tout au long de la fellowship.",
        },
      },
      {
        title: { en: "Lead a session", fr: "Animer une session" },
        body: {
          en: "Share your expertise with a whole cohort.",
          fr: "Partagez votre expertise avec toute une promotion.",
        },
      },
      {
        title: {
          en: "Give project feedback",
          fr: "Donner un retour sur les projets",
        },
        body: {
          en: "Review fellows' work and help them improve it.",
          fr: "Relisez le travail des fellows et aidez-les à l'améliorer.",
        },
      },
      {
        title: { en: "Open a door", fr: "Ouvrir une porte" },
        body: {
          en: "An introduction that leads to a first opportunity.",
          fr: "Une mise en relation qui mène à une première opportunité.",
        },
      },
    ],
    getHeadline: { en: "What you get back.", fr: "Ce que vous y gagnez." },
    gets: [
      {
        en: "A fresh perspective from the next generation",
        fr: "Un regard neuf venu de la nouvelle génération",
      },
      {
        en: "A wider network of peers and young talent",
        fr: "Un réseau élargi de pairs et de jeunes talents",
      },
      {
        en: "Proof that your experience counts",
        fr: "La preuve que votre expérience compte",
      },
    ],
    formHeadline: {
      en: "Tell us what you could share.",
      fr: "Dites-nous ce que vous pourriez partager.",
    },
  },
};
