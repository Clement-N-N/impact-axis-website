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
import { eventPerson } from "./eventPerson";
import { eventPartner } from "./eventPartner";
import { event } from "./event";
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { localizedPortableText } from "./objects/localizedPortableText";
import { eventPersonRole } from "./objects/eventPersonRole";

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
  eventPerson,
  eventPartner,
  event,
  localizedString,
  localizedText,
  localizedPortableText,
  eventPersonRole,
];
