import type { StructureResolver } from "sanity/structure";
import { HOME_SETTINGS_ID, HOME_SETTINGS_TYPE } from "./schemaTypes/homeSettings";
import { HOME_FAQ_ID, HOME_FAQ_TYPE } from "./schemaTypes/homeFaq";
import { HOME_TESTIMONIALS_ID, HOME_TESTIMONIALS_TYPE } from "./schemaTypes/homeTestimonials";
import { HOME_IMPACT_ID, HOME_IMPACT_TYPE } from "./schemaTypes/homeImpact";

const SINGLETONS = [
  { id: HOME_SETTINGS_ID, type: HOME_SETTINGS_TYPE, title: "Home Page Settings" },
  { id: HOME_FAQ_ID, type: HOME_FAQ_TYPE, title: "FAQ" },
  { id: HOME_TESTIMONIALS_ID, type: HOME_TESTIMONIALS_TYPE, title: "Home Page Testimonials" },
  { id: HOME_IMPACT_ID, type: HOME_IMPACT_TYPE, title: "Home Page Impact Stats" },
];

const SINGLETON_TYPES = new Set<string>(SINGLETONS.map((s) => s.type));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map(({ id, type, title }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(type).documentId(id)),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
