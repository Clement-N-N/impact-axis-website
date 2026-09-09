import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { HOME_PAGE_TYPE } from "./schemaTypes/homePage";
import { ABOUT_PAGE_TYPE } from "./schemaTypes/aboutPage";
import { JOURNEY_PAGE_TYPE } from "./schemaTypes/journeyPage";
import { HOME_SETTINGS_TYPE } from "./schemaTypes/homeSettings";
import { HOME_FAQ_TYPE } from "./schemaTypes/homeFaq";
import { HOME_TESTIMONIALS_TYPE } from "./schemaTypes/homeTestimonials";
import { HOME_IMPACT_TYPE } from "./schemaTypes/homeImpact";
import { SOCIAL_LINKS_TYPE } from "./schemaTypes/socialLinks";

const SINGLETON_ACTIONS_TO_HIDE = new Set(["duplicate", "delete"]);
const SINGLETON_TYPES = new Set([
  HOME_PAGE_TYPE,
  ABOUT_PAGE_TYPE,
  JOURNEY_PAGE_TYPE,
  HOME_SETTINGS_TYPE,
  HOME_FAQ_TYPE,
  HOME_TESTIMONIALS_TYPE,
  HOME_IMPACT_TYPE,
  SOCIAL_LINKS_TYPE,
]);

export default defineConfig({
  name: "default",
  title: "Impact Axis",

  projectId: "r4ex3fmf",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter((action) => !SINGLETON_ACTIONS_TO_HIDE.has(action.action ?? ""))
        : prev,
  },
});
