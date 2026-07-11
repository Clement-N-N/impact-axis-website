import type { SchemaTypeDefinition } from "sanity";
import { homeSettings } from "./homeSettings";
import { homeFaq } from "./homeFaq";
import { homeTestimonials } from "./homeTestimonials";
import { testimonial } from "./testimonial";
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { localizedPortableText } from "./objects/localizedPortableText";

export const schemaTypes: SchemaTypeDefinition[] = [
  homeSettings,
  homeFaq,
  homeTestimonials,
  testimonial,
  localizedString,
  localizedText,
  localizedPortableText,
];
