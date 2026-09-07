import type { StructureResolver } from "sanity/structure";
import { HOME_PAGE_ID, HOME_PAGE_TYPE } from "./schemaTypes/homePage";
import { ABOUT_PAGE_ID, ABOUT_PAGE_TYPE } from "./schemaTypes/aboutPage";
import { TEAM_MEMBER_TYPE } from "./schemaTypes/teamMember";
import { PARTNER_LOGO_TYPE } from "./schemaTypes/partnerLogo";
import { JOURNEY_PAGE_ID, JOURNEY_PAGE_TYPE } from "./schemaTypes/journeyPage";
import { JOURNEY_MILESTONE_TYPE } from "./schemaTypes/journeyMilestone";
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
const EXPLICITLY_PLACED_TYPES = new Set([
  HOME_PAGE_TYPE,
  ABOUT_PAGE_TYPE,
  TEAM_MEMBER_TYPE,
  PARTNER_LOGO_TYPE,
  JOURNEY_PAGE_TYPE,
  JOURNEY_MILESTONE_TYPE,
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
      // ── Home Page ──
      S.listItem()
        .id("homeGroup")
        .title("Home Page")
        .child(
          S.list()
            .title("Home Page")
            .items([
              S.listItem()
                .id(HOME_PAGE_ID)
                .title("Home Page Content")
                .child(
                  S.document()
                    .schemaType(HOME_PAGE_TYPE)
                    .documentId(HOME_PAGE_ID),
                ),
              S.listItem()
                .id(HOME_SETTINGS_ID)
                .title("Hero Variant & Settings")
                .child(
                  S.document()
                    .schemaType(HOME_SETTINGS_TYPE)
                    .documentId(HOME_SETTINGS_ID),
                ),
              S.listItem()
                .id(HOME_IMPACT_ID)
                .title("Impact Stats")
                .child(
                  S.document()
                    .schemaType(HOME_IMPACT_TYPE)
                    .documentId(HOME_IMPACT_ID),
                ),
              S.listItem()
                .id(HOME_FAQ_ID)
                .title("FAQ Section")
                .child(
                  S.document()
                    .schemaType(HOME_FAQ_TYPE)
                    .documentId(HOME_FAQ_ID),
                ),
            ]),
        ),

      // ── About Us ──
      S.listItem()
        .id("aboutGroup")
        .title("About Us")
        .child(
          S.list()
            .title("About Us")
            .items([
              S.listItem()
                .id(ABOUT_PAGE_ID)
                .title("Page Content")
                .child(
                  S.document()
                    .schemaType(ABOUT_PAGE_TYPE)
                    .documentId(ABOUT_PAGE_ID),
                ),
              S.documentTypeListItem(TEAM_MEMBER_TYPE).title("Team Members"),
              S.documentTypeListItem(PARTNER_LOGO_TYPE).title("Partner Logos"),
            ]),
        ),

      // ── Our Journey ──
      S.listItem()
        .id("journeyGroup")
        .title("Our Journey")
        .child(
          S.list()
            .title("Our Journey")
            .items([
              S.listItem()
                .id(JOURNEY_PAGE_ID)
                .title("Page Content (Hero & CTA)")
                .child(
                  S.document()
                    .schemaType(JOURNEY_PAGE_TYPE)
                    .documentId(JOURNEY_PAGE_ID),
                ),
              S.documentTypeListItem(JOURNEY_MILESTONE_TYPE).title("Milestones (Timeline)"),
            ]),
        ),

      // ── Blog ──
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

      // ── Events ──
      S.listItem()
        .id("eventsGroup")
        .title("Events")
        .child(
          S.list()
            .title("Events")
            .items([
              S.documentTypeListItem(EVENT_TYPE).title("Events"),
              S.documentTypeListItem(EVENT_PERSON_TYPE).title("Speakers & Guests"),
              S.documentTypeListItem(EVENT_PARTNER_TYPE).title("Partners"),
            ]),
        ),

      // ── Testimonials ──
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
                  S.document()
                    .schemaType(HOME_TESTIMONIALS_TYPE)
                    .documentId(HOME_TESTIMONIALS_ID),
                ),
            ]),
        ),

      // ── Global / Site Settings ──
      S.listItem()
        .id(SOCIAL_LINKS_ID)
        .title("Social Links")
        .child(S.document().schemaType(SOCIAL_LINKS_TYPE).documentId(SOCIAL_LINKS_ID)),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !EXPLICITLY_PLACED_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
