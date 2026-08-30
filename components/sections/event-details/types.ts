import type { LocalizedText } from "@/components/sections/home-hero/types";
import type { LocalizedPortableText, SanityImageValue } from "@/sanity/types";

export type EventSpeaker = {
  name: string;
  title: LocalizedText;
  image?: SanityImageValue;
};

export type EventPartner = {
  name: string;
  logo?: SanityImageValue;
};

export type EventDetail = {
  heroImage: SanityImageValue;
  registerHref: string;
  speakers: EventSpeaker[];
  partners: EventPartner[];
  programOverview: LocalizedPortableText;
  specialGuests: EventSpeaker[];
};

export type EventDetailsContent = {
  registerLabel: LocalizedText;
  speakersLabel: LocalizedText;
  partnersLabel: LocalizedText;
  overviewLabel: LocalizedText;
  specialGuestsLabel: LocalizedText;
};
