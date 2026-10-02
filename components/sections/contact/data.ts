import type { LocalizedText } from "@/components/sections/home-hero/types";

export type ContactTopic = {
  id: string;
  label: LocalizedText;
  /** Message placeholder tailored to the topic. */
  prompt: LocalizedText;
};

export const contactContent = {
  eyebrow: { en: "Contact", fr: "Contact" },
  headline: {
    en: "Let's start a conversation.",
    fr: "Commençons à échanger.",
  },
  intro: {
    en: "Whether you want to join a programme, partner with us or simply learn more, tell us a little about yourself and we'll get back to you.",
    fr: "Que vous souhaitiez rejoindre un programme, devenir partenaire ou simplement en savoir plus, dites-nous quelques mots sur vous et nous reviendrons vers vous.",
  },
  topicLabel: { en: "What's this about?", fr: "De quoi s'agit-il ?" },
  topics: [
    {
      id: "programme",
      label: { en: "Joining a programme", fr: "Rejoindre un programme" },
      prompt: {
        en: "Tell us a little about yourself and what you hope to get from a programme…",
        fr: "Parlez-nous un peu de vous et de ce que vous attendez d'un programme…",
      },
    },
    {
      id: "partnership",
      label: { en: "Partnership", fr: "Partenariat" },
      prompt: {
        en: "Tell us about your organisation and the outcome you'd like to create together…",
        fr: "Parlez-nous de votre organisation et du résultat que vous aimeriez créer ensemble…",
      },
    },
    {
      id: "mentoring",
      label: { en: "Mentoring or volunteering", fr: "Mentorat ou bénévolat" },
      prompt: {
        en: "Tell us about your experience and how you'd like to support young people…",
        fr: "Parlez-nous de votre expérience et de la manière dont vous aimeriez accompagner les jeunes…",
      },
    },
    {
      id: "media",
      label: { en: "Media", fr: "Médias" },
      prompt: {
        en: "Tell us about your publication and what you're working on…",
        fr: "Parlez-nous de votre média et du sujet sur lequel vous travaillez…",
      },
    },
    {
      id: "other",
      label: { en: "Something else", fr: "Autre chose" },
      prompt: {
        en: "How can we help?",
        fr: "Comment pouvons-nous vous aider ?",
      },
    },
  ] satisfies ContactTopic[],
  fields: {
    name: { en: "Your name", fr: "Votre nom" },
    email: { en: "Email address", fr: "Adresse e-mail" },
    message: { en: "Your message", fr: "Votre message" },
  },
  submit: { en: "Send message", fr: "Envoyer le message" },
  submitNote: {
    en: "This opens your email app with your message ready to send.",
    fr: "Votre application de messagerie s'ouvrira avec votre message prêt à être envoyé.",
  },
  sent: {
    en: "Your email app should now be open. If it didn't open, write to us directly at",
    fr: "Votre application de messagerie devrait être ouverte. Si ce n'est pas le cas, écrivez-nous directement à",
  },
  errors: {
    required: {
      en: "Please fill in this field.",
      fr: "Veuillez remplir ce champ.",
    },
    email: {
      en: "Please enter a valid email address.",
      fr: "Veuillez saisir une adresse e-mail valide.",
    },
  },
  details: {
    heading: { en: "Reach us directly", fr: "Contactez-nous directement" },
    email: { en: "Email", fr: "E-mail" },
    phone: { en: "Phone", fr: "Téléphone" },
    visit: { en: "Visit", fr: "Adresse" },
    follow: { en: "Follow us", fr: "Suivez-nous" },
  },
  faq: {
    eyebrow: { en: "FAQ", fr: "FAQ" },
    headline: {
      en: "Questions we're often asked.",
      fr: "Les questions qu'on nous pose souvent.",
    },
    still: {
      en: "Didn't find your answer? Ask us above.",
      fr: "Vous n'avez pas trouvé votre réponse ? Posez-nous la question ci-dessus.",
    },
  },
};
