import type { LocalizedText } from "@/components/sections/home-hero/types";

/**
 * Fallback copy for the blog. Everything here can be overridden from the
 * "Blog Page" document in Sanity; these are only used for fields left empty.
 */
export const blogDefaults = {
  eyebrow: { en: "Impact Blog", fr: "Blog Impact" },
  title: {
    en: "Ideas and stories on getting young Cameroonians into meaningful work.",
    fr: "Idées et histoires pour aider les jeunes Camerounais à accéder à un travail porteur de sens.",
  },
  intro: {
    en: "Practical advice for young people, lessons for employers and partners, and news from our programmes.",
    fr: "Des conseils pratiques pour les jeunes, des enseignements pour les employeurs et les partenaires, et des nouvelles de nos programmes.",
  },
  cta: {
    eyebrow: { en: "Programmes", fr: "Programmes" },
    title: { en: "Build these skills with a cohort of peers", fr: "Développez ces compétences avec une promotion de pairs" },
    text: {
      en: "Our programmes help young Cameroonians build the skills, experience and networks employers look for.",
      fr: "Nos programmes aident les jeunes Camerounais à développer les compétences, l'expérience et les réseaux que recherchent les employeurs.",
    },
    buttonLabel: { en: "See our programmes", fr: "Voir nos programmes" },
    buttonHref: "/what-we-do",
  },
} satisfies Record<string, unknown>;

export const blogLabels = {
  allPosts: { en: "All posts", fr: "Tous les articles" },
  filterLabel: { en: "Filter posts by topic", fr: "Filtrer les articles par thème" },
  featured: { en: "Featured", fr: "À la une" },
  readStory: { en: "Read the story", fr: "Lire l'article" },
  minRead: { en: "min read", fr: "min de lecture" },
  noPosts: {
    en: "No posts in this topic yet. See all posts for the latest.",
    fr: "Pas encore d'article sur ce thème. Consultez tous les articles pour les plus récents.",
  },
  blog: { en: "Blog", fr: "Blog" },
  onThisPage: { en: "On this page", fr: "Sur cette page" },
  share: { en: "Share this article", fr: "Partager cet article" },
  copyLink: { en: "Copy link", fr: "Copier le lien" },
  copied: { en: "Link copied", fr: "Lien copié" },
  keepReading: { en: "Keep reading", fr: "À lire aussi" },
  keyTakeaways: { en: "Key takeaways", fr: "À retenir" },
  tip: { en: "Tip", fr: "Conseil" },
  post: { en: "post", fr: "article" },
  posts: { en: "posts", fr: "articles" },
} satisfies Record<string, LocalizedText>;
