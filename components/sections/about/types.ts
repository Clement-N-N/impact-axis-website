import type { LocalizedText } from "@/components/sections/home-hero/types";

export type AboutHeroContent = {
  headline: LocalizedText;
  paragraph: LocalizedText;
  ctaPartner: LocalizedText;
  ctaStory: LocalizedText;
};


export type WhyWeExistAboutContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  paragraph1: LocalizedText;
  paragraph2: LocalizedText;
  callout: LocalizedText;
  imageCaptionHeader: LocalizedText;
  imageCaptionBody: LocalizedText;
};

export type MissionVisionContent = {
  missionTitle: LocalizedText;
  missionBody: LocalizedText;
  visionTitle: LocalizedText;
  visionBody: LocalizedText;
};

export type ApproachStep = {
  stepNumber: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
};

export type OurApproachContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  steps: ApproachStep[];
  summaryBanner: LocalizedText;
};

export type OurStoryContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  photoBadgeTag: LocalizedText;
  photoBadgeCaption: LocalizedText;
  paragraph1: LocalizedText;
  paragraph2: LocalizedText;
  paragraph3: LocalizedText;
  paragraph4: LocalizedText;
  timelineBadge: LocalizedText;
  timelineText: LocalizedText;
};

export type PrincipleItem = {
  title: LocalizedText;
  description: LocalizedText;
};

export type OurPrinciplesContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  principles: PrincipleItem[];
};

export type CoreTeamMember = {
  name: string;
  role: LocalizedText;
  initials: string;
  bio: LocalizedText;
  image?: string;
};

export type AdvisoryBoardMember = {
  name: string;
  initials: string;
  bio: LocalizedText;
  image?: string;
};

export type OurPeopleContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  coreTeamHeader: LocalizedText;
  coreTeamSubheader: LocalizedText;
  coreTeam: CoreTeamMember[];
  advisoryBoardHeader: LocalizedText;
  advisoryBoardSubheader: LocalizedText;
  advisoryBoard: AdvisoryBoardMember[];
};

export type PartnerLogo = {
  name: string;
  logoUrl: string;
};

export type PartnershipContent = {
  eyebrow: LocalizedText;
  headline: LocalizedText;
  subtitle: LocalizedText;
  partnerLogos: PartnerLogo[];
  leftBanner: {
    headline: LocalizedText;
    paragraph: LocalizedText;
    ctaLabel: LocalizedText;
  };
  rightBanner: {
    headline: LocalizedText;
    paragraph: LocalizedText;
    ctaLabel: LocalizedText;
    email: string;
  };
};

export type AboutPageContent = {
  hero: AboutHeroContent;
  whyWeExist: WhyWeExistAboutContent;
  missionVision: MissionVisionContent;
  ourApproach: OurApproachContent;
  ourStory: OurStoryContent;
  ourPrinciples: OurPrinciplesContent;
  ourPeople: OurPeopleContent;
  partnership: PartnershipContent;
};
