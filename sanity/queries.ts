import { defineQuery } from "next-sanity";

export const HOME_SETTINGS_QUERY = defineQuery(
  `*[_type == "homeSettings"][0]{ heroVariant }`,
);

export const HOME_FAQ_QUERY = defineQuery(`*[_type == "homeFaq"][0]{
  faqs[]{
    question{en, fr},
    answer{en, fr}
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
