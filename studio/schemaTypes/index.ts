import type { SchemaTypeDefinition } from "sanity";
import { homeSettings } from "./homeSettings";
import { homeFaq } from "./homeFaq";
import { homeTestimonials } from "./homeTestimonials";
import { homeImpact } from "./homeImpact";
import { socialLinks } from "./socialLinks";
import { testimonial } from "./testimonial";
import { blogAuthor } from "./blogAuthor";
import { blogCategory } from "./blogCategory";
import { blogPost } from "./blogPost";
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { localizedPortableText } from "./objects/localizedPortableText";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeSettings,
  homeFaq,
  homeTestimonials,
  homeImpact,
  socialLinks,
  testimonial,
  blogAuthor,
  blogCategory,
  blogPost,
  localizedString,
  localizedText,
  localizedPortableText,
];
