import type { StructureResolver } from "sanity/structure";
import { HOME_SETTINGS_ID, HOME_SETTINGS_TYPE } from "./schemaTypes/homeSettings";
import { HOME_FAQ_ID, HOME_FAQ_TYPE } from "./schemaTypes/homeFaq";
import { HOME_TESTIMONIALS_ID, HOME_TESTIMONIALS_TYPE } from "./schemaTypes/homeTestimonials";
import { HOME_IMPACT_ID, HOME_IMPACT_TYPE } from "./schemaTypes/homeImpact";
import { TESTIMONIAL_TYPE } from "./schemaTypes/testimonial";
import { BLOG_POST_TYPE } from "./schemaTypes/blogPost";
import { BLOG_AUTHOR_TYPE } from "./schemaTypes/blogAuthor";
import { BLOG_CATEGORY_TYPE } from "./schemaTypes/blogCategory";

// Every type placed explicitly below (either as a pinned singleton or inside
// a group) — excluded from the catch-all fallback so it isn't listed twice.
// Any future schema type NOT added here still shows up via the fallback.
const EXPLICITLY_PLACED_TYPES = new Set([
  HOME_SETTINGS_TYPE,
  HOME_FAQ_TYPE,
  HOME_TESTIMONIALS_TYPE,
  HOME_IMPACT_TYPE,
  TESTIMONIAL_TYPE,
  BLOG_POST_TYPE,
  BLOG_AUTHOR_TYPE,
  BLOG_CATEGORY_TYPE,
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
        .id(HOME_SETTINGS_ID)
        .title("Home Page Settings")
        .child(S.document().schemaType(HOME_SETTINGS_TYPE).documentId(HOME_SETTINGS_ID)),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !EXPLICITLY_PLACED_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
