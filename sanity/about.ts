import { client } from "./client";
import { urlFor } from "./image";
import { ABOUT_PAGE_QUERY, TEAM_MEMBERS_QUERY, PARTNER_LOGOS_QUERY } from "./queries";
import type {
  AboutPageContent,
  CoreTeamMember,
  AdvisoryBoardMember,
  PartnerLogo,
} from "@/components/sections/about/types";
import { aboutPageContent as defaultContent } from "@/components/sections/about/data";

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const [pageResult, teamResult, partnersResult] = await Promise.all([
      client.fetch(ABOUT_PAGE_QUERY, {}, { next: { revalidate: 60 } }),
      client.fetch(TEAM_MEMBERS_QUERY, {}, { next: { revalidate: 60 } }),
      client.fetch(PARTNER_LOGOS_QUERY, {}, { next: { revalidate: 60 } }),
    ]);

    if (!pageResult?.heroHeadline?.en && !teamResult?.length) {
      return defaultContent;
    }

    // Process team members into core and advisory
    const coreTeam: CoreTeamMember[] = [];
    const advisoryBoard: AdvisoryBoardMember[] = [];

    if (Array.isArray(teamResult) && teamResult.length > 0) {
      for (const m of teamResult) {
        let imageUrl: string | undefined = undefined;
        if (m.image) {
          try {
            imageUrl = urlFor(m.image).url();
          } catch {
            // ignore
          }
        }

        if (m.group === "coreTeam") {
          coreTeam.push({
            name: m.name,
            role: m.role || { en: "", fr: "" },
            initials: m.initials || m.name?.slice(0, 2).toUpperCase() || "",
            bio: m.bio || { en: "", fr: "" },
            image: imageUrl,
          });
        } else if (m.group === "advisoryBoard") {
          advisoryBoard.push({
            name: m.name,
            initials: m.initials || m.name?.slice(0, 2).toUpperCase() || "",
            bio: m.bio || { en: "", fr: "" },
            image: imageUrl,
          });
        }
      }
    }

    // Process partner logos
    let partnerLogos: PartnerLogo[] = [];
    if (Array.isArray(partnersResult) && partnersResult.length > 0) {
      partnerLogos = partnersResult.map((p: { name: string; logo?: Parameters<typeof urlFor>[0] }) => {
        let logoUrl = "";
        if (p.logo) {
          try {
            logoUrl = urlFor(p.logo).url();
          } catch {
            // ignore
          }
        }
        return {
          name: p.name,
          logoUrl,
        };
      });
    }

    return {
      hero: {
        headline: pageResult?.heroHeadline || defaultContent.hero.headline,
        paragraph: pageResult?.heroParagraph || defaultContent.hero.paragraph,
        ctaPartner: pageResult?.heroCtaPartner || defaultContent.hero.ctaPartner,
        ctaStory: pageResult?.heroCtaStory || defaultContent.hero.ctaStory,
      },
      whyWeExist: {
        eyebrow: pageResult?.wweEyebrow || defaultContent.whyWeExist.eyebrow,
        headline: pageResult?.wweHeadline || defaultContent.whyWeExist.headline,
        paragraph1: pageResult?.wweParagraph1 || defaultContent.whyWeExist.paragraph1,
        paragraph2: pageResult?.wweParagraph2 || defaultContent.whyWeExist.paragraph2,
        callout: pageResult?.wweCallout || defaultContent.whyWeExist.callout,
        imageCaptionHeader: pageResult?.wweImageCaptionHeader || defaultContent.whyWeExist.imageCaptionHeader,
        imageCaptionBody: pageResult?.wweImageCaptionBody || defaultContent.whyWeExist.imageCaptionBody,
      },
      missionVision: {
        missionTitle: pageResult?.missionTitle || defaultContent.missionVision.missionTitle,
        missionBody: pageResult?.missionBody || defaultContent.missionVision.missionBody,
        visionTitle: pageResult?.visionTitle || defaultContent.missionVision.visionTitle,
        visionBody: pageResult?.visionBody || defaultContent.missionVision.visionBody,
      },
      ourApproach: {
        eyebrow: pageResult?.approachEyebrow || defaultContent.ourApproach.eyebrow,
        headline: pageResult?.approachHeadline || defaultContent.ourApproach.headline,
        subtitle: pageResult?.approachSubtitle || defaultContent.ourApproach.subtitle,
        steps: pageResult?.approachSteps?.length ? pageResult.approachSteps : defaultContent.ourApproach.steps,
        summaryBanner: pageResult?.approachSummaryBanner || defaultContent.ourApproach.summaryBanner,
      },
      ourStory: {
        eyebrow: pageResult?.storyEyebrow || defaultContent.ourStory.eyebrow,
        headline: pageResult?.storyHeadline || defaultContent.ourStory.headline,
        photoBadgeTag: pageResult?.storyPhotoBadgeTag || defaultContent.ourStory.photoBadgeTag,
        photoBadgeCaption: pageResult?.storyPhotoBadgeCaption || defaultContent.ourStory.photoBadgeCaption,
        paragraph1: pageResult?.storyParagraph1 || defaultContent.ourStory.paragraph1,
        paragraph2: pageResult?.storyParagraph2 || defaultContent.ourStory.paragraph2,
        paragraph3: pageResult?.storyParagraph3 || defaultContent.ourStory.paragraph3,
        paragraph4: pageResult?.storyParagraph4 || defaultContent.ourStory.paragraph4,
        timelineBadge: pageResult?.storyTimelineBadge || defaultContent.ourStory.timelineBadge,
        timelineText: pageResult?.storyTimelineText || defaultContent.ourStory.timelineText,
      },
      ourPrinciples: {
        eyebrow: pageResult?.principlesEyebrow || defaultContent.ourPrinciples.eyebrow,
        headline: pageResult?.principlesHeadline || defaultContent.ourPrinciples.headline,
        principles: pageResult?.principles?.length ? pageResult.principles : defaultContent.ourPrinciples.principles,
      },
      ourPeople: {
        eyebrow: pageResult?.peopleEyebrow || defaultContent.ourPeople.eyebrow,
        headline: pageResult?.peopleHeadline || defaultContent.ourPeople.headline,
        subtitle: pageResult?.peopleSubtitle || defaultContent.ourPeople.subtitle,
        coreTeamHeader: pageResult?.coreTeamHeader || defaultContent.ourPeople.coreTeamHeader,
        coreTeamSubheader: pageResult?.coreTeamSubheader || defaultContent.ourPeople.coreTeamSubheader,
        coreTeam: coreTeam.length > 0 ? coreTeam : defaultContent.ourPeople.coreTeam,
        advisoryBoardHeader: pageResult?.advisoryBoardHeader || defaultContent.ourPeople.advisoryBoardHeader,
        advisoryBoardSubheader: pageResult?.advisoryBoardSubheader || defaultContent.ourPeople.advisoryBoardSubheader,
        advisoryBoard: advisoryBoard.length > 0 ? advisoryBoard : defaultContent.ourPeople.advisoryBoard,
      },
      partnership: {
        eyebrow: pageResult?.partnershipEyebrow || defaultContent.partnership.eyebrow,
        headline: pageResult?.partnershipHeadline || defaultContent.partnership.headline,
        subtitle: pageResult?.partnershipSubtitle || defaultContent.partnership.subtitle,
        partnerLogos: partnerLogos.length > 0 ? partnerLogos : defaultContent.partnership.partnerLogos,
        leftBanner: {
          headline: pageResult?.leftBannerHeadline || defaultContent.partnership.leftBanner.headline,
          paragraph: pageResult?.leftBannerParagraph || defaultContent.partnership.leftBanner.paragraph,
          ctaLabel: pageResult?.leftBannerCtaLabel || defaultContent.partnership.leftBanner.ctaLabel,
        },
        rightBanner: {
          headline: pageResult?.rightBannerHeadline || defaultContent.partnership.rightBanner.headline,
          paragraph: pageResult?.rightBannerParagraph || defaultContent.partnership.rightBanner.paragraph,
          ctaLabel: pageResult?.rightBannerCtaLabel || defaultContent.partnership.rightBanner.ctaLabel,
          email: pageResult?.rightBannerEmail || defaultContent.partnership.rightBanner.email,
        },
      },
    };
  } catch (error) {
    console.error("Failed to fetch About page content from Sanity:", error);
    return defaultContent;
  }
}
