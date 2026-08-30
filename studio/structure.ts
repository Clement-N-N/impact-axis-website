import type { StructureResolver } from "sanity/structure";
import { HOME_SETTINGS_ID, HOME_SETTINGS_TYPE } from "./schemaTypes/homeSettings";
import { HOME_FAQ_ID, HOME_FAQ_TYPE } from "./schemaTypes/homeFaq";
import { HOME_TESTIMONIALS_ID, HOME_TESTIMONIALS_TYPE } from "./schemaTypes/homeTestimonials";
import { HOME_IMPACT_ID, HOME_IMPACT_TYPE } from "./schemaTypes/homeImpact";
import { SOCIAL_LINKS_ID, SOCIAL_LINKS_TYPE } from "./schemaTypes/socialLinks";
import { TESTIMONIAL_TYPE } from "./schemaTypes/testimonial";
import { BLOG_POST_TYPE } from "./schemaTypes/blogPost";
import { BLOG_AUTHOR_TYPE } from "./schemaTypes/blogAuthor";
import { BLOG_CATEGORY_TYPE } from "./schemaTypes/blogCategory";
import { EVENT_TYPE } from "./schemaTypes/event";
import { EVENT_PERSON_TYPE } from "./schemaTypes/eventPerson";
import { EVENT_PARTNER_TYPE } from "./schemaTypes/eventPartner";

// Every type placed explicitly below (either as a pinned singleton or inside
// a group) — excluded from the catch-all fallback so it isn't listed twice.
// Any future schema type NOT added here still shows up via the fallback.
const EXPLICITLY_PLACED_TYPES = new Set([
  HOME_SETTINGS_TYPE,
  HOME_FAQ_TYPE,
  HOME_TESTIMONIALS_TYPE,
  HOME_IMPACT_TYPE,
  SOCIAL_LINKS_TYPE,
  TESTIMONIAL_TYPE,
  BLOG_POST_TYPE,
  BLOG_AUTHOR_TYPE,
  BLOG_CATEGORY_TYPE,
  EVENT_TYPE,
  EVENT_PERSON_TYPE,
  EVENT_PARTNER_TYPE,
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Ordered by how often each feature is actually touched, most to least.
      S.listItem()
        .id("blogGroup")
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem(BLOG_POST_TYPE).title("Posts"),
              S.documentTypeListItem(BLOG_AUTHOR_TYPE).title("Authors"),
              S.documentTypeListItem(BLOG_CATEGORY_TYPE).title("Categories"),
            ]),
        ),
      S.listItem()
        .id("eventsGroup")
        .title("Events")
        .child(
          S.list()
            .title("Events")
            .items([
              S.documentTypeListItem(EVENT_TYPE).title("Events"),
              S.documentTypeListItem(EVENT_PERSON_TYPE).title("Speakers"),
              S.documentTypeListItem(EVENT_PARTNER_TYPE).title("Partners"),
            ]),
        ),
      S.listItem()
        .id("testimonialsGroup")
        .title("Testimonials")
        .child(
          S.list()
            .title("Testimonials")
            .items([
              S.documentTypeListItem(TESTIMONIAL_TYPE).title("Entries"),
              S.listItem()
                .id(HOME_TESTIMONIALS_ID)
                .title("Home Page Selection")
                .child(
                  S.document().schemaType(HOME_TESTIMONIALS_TYPE).documentId(HOME_TESTIMONIALS_ID),
                ),
            ]),
        ),
      S.listItem()
        .id(HOME_FAQ_ID)
        .title("FAQ")
        .child(S.document().schemaType(HOME_FAQ_TYPE).documentId(HOME_FAQ_ID)),
      S.listItem()
        .id(HOME_IMPACT_ID)
        .title("Home Page Impact Stats")
        .child(S.document().schemaType(HOME_IMPACT_TYPE).documentId(HOME_IMPACT_ID)),
      S.listItem()
        .id(SOCIAL_LINKS_ID)
        .title("Social Links")
        .child(S.document().schemaType(SOCIAL_LINKS_TYPE).documentId(SOCIAL_LINKS_ID)),
      S.listItem()
        .id(HOME_SETTINGS_ID)
        .title("Home Page Settings")
        .child(S.document().schemaType(HOME_SETTINGS_TYPE).documentId(HOME_SETTINGS_ID)),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !EXPLICITLY_PLACED_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
