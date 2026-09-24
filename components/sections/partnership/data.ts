import type { PartnershipPageContent } from "./types";

export const partnershipContent: PartnershipPageContent = {
  // One shared photo for all four audiences for now — swap per-audience here
  // if/when real photography lands.
  image: "/images/team-1.jpg",

  statement: {
    en: "Across Cameroon, many young people complete their education with ambition and potential, yet enter the world of work without enough practical experience, career guidance, professional networks or exposure to opportunity.",
    fr: "Partout au Cameroun, de nombreux jeunes terminent leurs études avec de l'ambition et du potentiel, mais entrent dans le monde du travail sans expérience pratique suffisante, sans orientation professionnelle, sans réseaux professionnels ni exposition aux opportunités.",
  },

  audiences: {
    "funders-development-partners": {
      name: {
        en: "Funders & Development Partners",
        fr: "Financeurs et partenaires de développement",
      },
      headline: {
        en: "Invest in pathways that move young people forward.",
        fr: "Investir dans des parcours qui font avancer les jeunes.",
      },
      paragraphs: [
        {
          en: "We partner with foundations, development organisations, embassies, corporate foundations and philanthropic partners to fund and strengthen youth workforce development programmes in Cameroon.",
          fr: "Nous collaborons avec des fondations, des organisations de développement, des ambassades, des fondations d'entreprise et des partenaires philanthropiques pour financer et renforcer les programmes de développement de l'employabilité des jeunes au Cameroun.",
        },
        {
          en: "Funding partnerships can support programme delivery, expansion into underserved communities, digital and AI readiness, innovation, research and stronger measurement of youth employment outcomes.",
          fr: "Les partenariats de financement peuvent soutenir la mise en œuvre des programmes, leur extension vers des communautés mal desservies, la préparation au numérique et à l'IA, l'innovation, la recherche et une meilleure mesure des résultats en matière d'emploi des jeunes.",
        },
        {
          en: "Our aim is to build partnerships around measurable progress, from capability development and practical experience to young people's transition into meaningful opportunities.",
          fr: "Notre objectif est de bâtir des partenariats autour de progrès mesurables, du développement des compétences et de l'expérience pratique jusqu'à la transition des jeunes vers des opportunités porteuses de sens.",
        },
      ],
      formSubject: {
        en: "Inquiry for funders and development partnership",
        fr: "Demande de partenariat pour financeurs et partenaires de développement",
      },
      metaDescription: {
        en: "Partner with Impact Axis to fund and strengthen youth workforce development programmes in Cameroon.",
        fr: "Collaborez avec Impact Axis pour financer et renforcer les programmes de développement de l'employabilité des jeunes au Cameroun.",
      },
    },

    "employers-corporate-partners": {
      name: {
        en: "Employers & Corporate Partners",
        fr: "Employeurs et entreprises partenaires",
      },
      headline: {
        en: "Bring the world of work closer to young people.",
        fr: "Rapprocher le monde du travail des jeunes.",
      },
      paragraphs: [
        {
          en: "Employers give young people something a classroom cannot fully replicate: exposure to real professional environments, expectations, challenges and opportunities.",
          fr: "Les employeurs offrent aux jeunes ce qu'une salle de classe ne peut pas pleinement reproduire : une exposition à de véritables environnements professionnels, à leurs exigences, à leurs défis et à leurs opportunités.",
        },
        {
          en: "We collaborate with companies and professionals to create workplace exposure, mentorship, applied projects, career conversations, internships and other early-career opportunities.",
          fr: "Nous collaborons avec des entreprises et des professionnels pour créer des expériences en milieu de travail, du mentorat, des projets appliqués, des échanges sur les carrières, des stages et d'autres opportunités de début de carrière.",
        },
        {
          en: "Corporate partners can also support youth workforce programmes through funding, expertise and employee engagement.",
          fr: "Les partenaires entreprises peuvent également soutenir les programmes d'employabilité des jeunes par le financement, l'expertise et l'engagement de leurs collaborateurs.",
        },
        {
          en: "Together, we can reduce the distance between what young people learn and what the workplace requires.",
          fr: "Ensemble, nous pouvons réduire l'écart entre ce que les jeunes apprennent et ce que le monde du travail exige.",
        },
      ],
      formSubject: {
        en: "Inquiry for employer and corporate partnership",
        fr: "Demande de partenariat pour employeurs et entreprises",
      },
      metaDescription: {
        en: "Create workplace exposure, mentorship and early-career opportunities for young people in Cameroon with Impact Axis.",
        fr: "Créez des expériences en milieu de travail, du mentorat et des opportunités de début de carrière pour les jeunes au Cameroun avec Impact Axis.",
      },
    },

    "education-training-institutions": {
      name: {
        en: "Education & Training Institutions",
        fr: "Institutions éducatives et de formation",
      },
      headline: {
        en: "Connect learning with career readiness.",
        fr: "Relier l'apprentissage à la préparation professionnelle.",
      },
      paragraphs: [
        {
          en: "We partner with universities, schools and training institutions to complement academic learning with practical employability and career-readiness experiences.",
          fr: "Nous collaborons avec des universités, des écoles et des centres de formation pour compléter l'apprentissage académique par des expériences concrètes d'employabilité et de préparation à la carrière.",
        },
        {
          en: "Through experiential workshops, applied projects, professional exposure and mentorship, students gain opportunities to practise durable skills and prepare for the transition beyond the classroom.",
          fr: "Grâce à des ateliers expérientiels, des projets appliqués, une exposition professionnelle et du mentorat, les étudiants ont l'occasion de mettre en pratique des compétences durables et de se préparer à la transition au-delà de la salle de classe.",
        },
        {
          en: "Together, we can help students leave education better prepared to navigate work and opportunity.",
          fr: "Ensemble, nous pouvons aider les étudiants à quitter le système éducatif mieux préparés à naviguer dans le monde du travail et des opportunités.",
        },
      ],
      formSubject: {
        en: "Inquiry for education and training partnership",
        fr: "Demande de partenariat pour institutions éducatives et de formation",
      },
      metaDescription: {
        en: "Partner with Impact Axis to complement academic learning with practical employability and career-readiness experiences.",
        fr: "Collaborez avec Impact Axis pour compléter l'apprentissage académique par des expériences concrètes d'employabilité et de préparation à la carrière.",
      },
    },

    "mentors-professionals": {
      name: {
        en: "Mentors & Professionals",
        fr: "Mentors et professionnels",
      },
      headline: {
        en: "Share experiences that can shape someone's next step.",
        fr: "Partager une expérience qui peut orienter le prochain pas de quelqu'un.",
      },
      paragraphs: [
        {
          en: "Access to the right guidance, perspective or professional relationship can change how a young person sees and navigates opportunity.",
          fr: "L'accès au bon accompagnement, à la bonne perspective ou à la bonne relation professionnelle peut changer la façon dont un jeune perçoit et saisit les opportunités.",
        },
        {
          en: "We work with professionals who contribute through mentorship, learning sessions, career conversations, project feedback, introductions and access to relevant opportunities.",
          fr: "Nous travaillons avec des professionnels qui contribuent par le mentorat, des sessions d'apprentissage, des échanges sur les carrières, des retours sur projets, des mises en relation et l'accès à des opportunités pertinentes.",
        },
        {
          en: "If you have experience worth sharing and a willingness to make it useful to someone coming after you, there is a place for you in our work.",
          fr: "Si vous avez une expérience qui mérite d'être partagée et l'envie de la rendre utile à ceux qui viennent après vous, vous avez votre place dans notre travail.",
        },
      ],
      formSubject: {
        en: "Inquiry for mentorship and professional contribution",
        fr: "Demande de contribution en tant que mentor ou professionnel",
      },
      metaDescription: {
        en: "Contribute mentorship, career conversations and professional guidance to young people in Cameroon with Impact Axis.",
        fr: "Apportez du mentorat, des échanges sur les carrières et un accompagnement professionnel aux jeunes au Cameroun avec Impact Axis.",
      },
    },
  },
};
