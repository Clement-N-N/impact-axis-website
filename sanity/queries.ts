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
    label{en, fr}
  }
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "blogPost" &&
  (!defined($categorySlug) || category->slug.current == $categorySlug)
] | order(date desc){
  "id": slug.current,
  title{en, fr},
  excerpt{en, fr},
  date,
  image,
  "href": "/blog/" + slug.current
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

export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  "id": slug.current,
  title{en, fr},
  excerpt{en, fr},
  date,
  image,
  "href": "/blog/" + slug.current,
  authorRole{en, fr},
  author->{name, image},
  category->{title{en, fr}},
  body{en, fr}
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
    video{
      asset->{
        url,
        mimeType
      }
    }
  }
}`);
