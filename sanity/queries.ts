import { defineQuery } from "next-sanity";

export const HOME_SETTINGS_QUERY = defineQuery(
  `*[_type == "homeSettings"][0]{ heroVariant }`,
);

export const SOCIAL_LINKS_QUERY = defineQuery(
  `*[_type == "socialLinks"][0]{ facebook, instagram, x, linkedin, youtube }`,
);

export const HOME_FAQ_QUERY = defineQuery(`*[_type == "homeFaq"][0]{
  faqs[]{
    question{en, fr},
    answer{en, fr}
  }
}`);

export const HOME_IMPACT_QUERY = defineQuery(`*[_type == "homeImpact"][0]{
  metrics[]{
    number,
    label{en, fr},
    visual,
    featured,
    detail{en, fr}
  }
}`);

// Card fields shared by every blog list. `chars` (body length per language)
// gives the "x min read" estimate without fetching whole bodies.
const BLOG_CARD_FIELDS = `
  "id": slug.current,
  title{en, fr},
  excerpt{en, fr},
  date,
  image,
  "href": "/blog/" + slug.current,
  category->{title{en, fr}, "slug": slug.current},
  "chars": {"en": length(pt::text(body.en)), "fr": length(pt::text(body.fr))}
`;

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "blogPost" &&
  (!defined($categorySlug) || category->slug.current == $categorySlug)
] | order(date desc){${BLOG_CARD_FIELDS}}`);

export const BLOG_PAGE_QUERY = defineQuery(`*[_id == "blogPage"][0]{
  eyebrow{en, fr},
  title{en, fr},
  intro{en, fr},
  featuredPost->{${BLOG_CARD_FIELDS}},
  cta{
    eyebrow{en, fr},
    title{en, fr},
    text{en, fr},
    buttonLabel{en, fr},
    buttonHref,
    image
  }
}`);

export const BLOG_CATEGORIES_QUERY = defineQuery(`*[_type == "blogCategory"] | order(title.en asc){
  title{en, fr},
  "slug": slug.current
}`);

export const BLOG_CATEGORY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "blogCategory" && slug.current == $slug][0]{ title{en, fr}, "slug": slug.current }`,
);

export const BLOG_CATEGORY_SLUGS_QUERY = defineQuery(
  `*[_type == "blogCategory"]{ "slug": slug.current }`,
);

// Inline images also bring their pixel size so they render at their own
// proportions instead of being cropped.
const BLOG_BODY_PROJECTION = `[]{
  ...,
  _type == "blogImage" => {..., "dims": asset->metadata.dimensions{width, height}}
}`;

export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  ${BLOG_CARD_FIELDS},
  authorRole{en, fr},
  author->{name, image},
  body{"en": en${BLOG_BODY_PROJECTION}, "fr": fr${BLOG_BODY_PROJECTION}}
}`);

export const BLOG_SLUGS_QUERY = defineQuery(`*[_type == "blogPost"]{ "slug": slug.current }`);

export const EVENTS_QUERY = defineQuery(`*[_type == "event"] | order(date asc){
  "slug": slug.current,
  title{en, fr},
  location{en, fr},
  date,
  heroImage
}`);

export const EVENT_DETAILS_QUERY = defineQuery(`*[_type == "event"]{
  "slug": slug.current,
  heroImage,
  registerHref,
  speakers[]{
    title{en, fr},
    "name": person->name,
    "image": person->image
  },
  partners[]->{name, logo},
  programOverview{en, fr},
  specialGuests[]{
    title{en, fr},
    "name": person->name,
    "image": person->image
  }
}`);

export const HOME_TESTIMONIALS_QUERY = defineQuery(`*[_type == "homeTestimonials"][0]{
  testimonials[]->{
    name,
    title{en, fr},
    summary{en, fr},
    image,
    youtubeUrl,
    video{
      asset->{
        url,
        mimeType
      }
    }
  }
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]{
  heroActiveVariant,
  heroHeadline{en, fr},
  heroDescription{en, fr},
  heroCtaLabel{en, fr},
  wweEyebrow{en, fr},
  wweHeadline{en, fr},
  wweParagraph1{en, fr},
  wweParagraph2{en, fr},
  solutionEyebrow{en, fr},
  solutionHeadline{en, fr},
  solutionParagraphs[]{
    en,
    fr
  },
  solutionButtonLabel{en, fr},
  wwbOverlayEyebrow{en, fr},
  wwbOverlayHeadline{en, fr},
  wwbSlides[]{
    legendLabel{en, fr},
    headline{en, fr},
    description{en, fr},
    image,
    buttonLabel{en, fr},
    buttonHref
  },
  wwsEyebrow{en, fr},
  wwsCards[]{
    number,
    label{en, fr},
    description{en, fr}
  },
  impactEyebrow{en, fr},
  impactParagraph{en, fr},
  impactReportCta{en, fr},
  bottomCtaTitle{en, fr},
  bottomCtaButtonLabel{en, fr}
}`);

export const REPORTS_QUERY = defineQuery(`*[
  _type == "report" && defined(file.asset)
] | order(publishedAt desc){
  "id": _id,
  title{en, fr},
  category,
  publishedAt,
  periodLabel{en, fr},
  summary{en, fr},
  featured,
  "fileUrl": file.asset->url,
  "coverImage": coverImage.asset->url
}`);
