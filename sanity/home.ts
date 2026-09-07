import { client } from "./client";
import { HOME_PAGE_QUERY } from "./queries";
import type { LocalizedText } from "@/components/sections/home-hero/types";
import { whyWeExistContent as defaultWhyWeExist } from "@/components/sections/why-we-exist/data";
import { homeSolutionContent as defaultSolution } from "@/components/sections/home-solution/data";
import { whatWeBuildContent as defaultWhatWeBuild } from "@/components/sections/what-we-build/data";
import { whoWeServeContent as defaultWhoWeServe } from "@/components/sections/who-we-serve/data";
import { ourImpactChrome as defaultOurImpact } from "@/components/sections/our-impact/data";
import { bottomCtaContent as defaultBottomCta } from "@/components/sections/bottom-cta/data";

export type HomePageData = {
  hero: {
    activeVariant?: string;
    headline?: LocalizedText;
    description?: LocalizedText;
    ctaLabel?: LocalizedText;
  };
  whyWeExist: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    paragraphs: LocalizedText[];
  };
  solution: {
    eyebrow: LocalizedText;
    headline: LocalizedText;
    button: { label: LocalizedText; href: string };
    paragraphs: LocalizedText[];
    image: string;
    imageAlt: LocalizedText;
  };
  whatWeBuild: {
    overlay: {
      eyebrow: LocalizedText;
      headline: LocalizedText;
      backgroundImage: string;
    };
    slides: {
      legendLabel: LocalizedText;
      headline: LocalizedText;
      description: LocalizedText;
      image: string;
      button: { label: LocalizedText; href: string };
    }[];
  };
  whoWeServe: {
    eyebrow: LocalizedText;
    cards: {
      icon: string;
      number: string;
      label: LocalizedText;
      description: LocalizedText;
    }[];
  };
  impactChrome: {
    eyebrow: LocalizedText;
    paragraph: LocalizedText;
    reportCta: LocalizedText;
  };
  bottomCta: {
    title: LocalizedText;
    buttonLabel: LocalizedText;
  };
};

export async function getHomePageContent(): Promise<HomePageData> {
  const fallback: HomePageData = {
    hero: {},
    whyWeExist: defaultWhyWeExist,
    solution: {
      eyebrow: defaultSolution.eyebrow,
      headline: defaultSolution.headline,
      button: defaultSolution.button,
      paragraphs: defaultSolution.paragraphs,
      image: defaultSolution.image,
      imageAlt: defaultSolution.imageAlt,
    },
    whatWeBuild: defaultWhatWeBuild,
    whoWeServe: defaultWhoWeServe,
    impactChrome: defaultOurImpact,
    bottomCta: {
      title: defaultBottomCta.block.title,
      buttonLabel: defaultBottomCta.block.button.label,
    },
  };

  try {
    const data = await client.fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 60 } });
    if (!data) return fallback;

    return {
      hero: {
        activeVariant: data.heroActiveVariant,
        headline: data.heroHeadline,
        description: data.heroDescription,
        ctaLabel: data.heroCtaLabel,
      },
      whyWeExist: {
        eyebrow: data.wweEyebrow || defaultWhyWeExist.eyebrow,
        headline: data.wweHeadline || defaultWhyWeExist.headline,
        paragraphs: [
          data.wweParagraph1 || defaultWhyWeExist.paragraphs[0],
          data.wweParagraph2 || defaultWhyWeExist.paragraphs[1],
        ],
      },
      solution: {
        eyebrow: data.solutionEyebrow || defaultSolution.eyebrow,
        headline: data.solutionHeadline || defaultSolution.headline,
        button: {
          label: data.solutionButtonLabel || defaultSolution.button.label,
          href: defaultSolution.button.href,
        },
        paragraphs: data.solutionParagraphs?.length
          ? data.solutionParagraphs
          : defaultSolution.paragraphs,
        image: defaultSolution.image,
        imageAlt: defaultSolution.imageAlt,
      },
      whatWeBuild: {
        overlay: {
          eyebrow: data.wwbOverlayEyebrow || defaultWhatWeBuild.overlay.eyebrow,
          headline: data.wwbOverlayHeadline || defaultWhatWeBuild.overlay.headline,
          backgroundImage: defaultWhatWeBuild.overlay.backgroundImage,
        },
        slides: defaultWhatWeBuild.slides.map((defaultSlide, idx) => {
          const cmsSlide = data.wwbSlides?.[idx];
          return {
            legendLabel: cmsSlide?.legendLabel || defaultSlide.legendLabel,
            headline: cmsSlide?.headline || defaultSlide.headline,
            description: cmsSlide?.description || defaultSlide.description,
            image: defaultSlide.image,
            button: {
              label: cmsSlide?.buttonLabel || defaultSlide.button.label,
              href: cmsSlide?.buttonHref || defaultSlide.button.href,
            },
          };
        }),
      },
      whoWeServe: {
        eyebrow: data.wwsEyebrow || defaultWhoWeServe.eyebrow,
        cards: defaultWhoWeServe.cards.map((defaultCard, idx) => {
          const cmsCard = data.wwsCards?.[idx];
          return {
            icon: defaultCard.icon,
            number: cmsCard?.number || defaultCard.number,
            label: cmsCard?.label || defaultCard.label,
            description: cmsCard?.description || defaultCard.description,
          };
        }),
      },
      impactChrome: {
        eyebrow: data.impactEyebrow || defaultOurImpact.eyebrow,
        paragraph: data.impactParagraph || defaultOurImpact.paragraph,
        reportCta: data.impactReportCta || defaultOurImpact.reportCta,
      },
      bottomCta: {
        title: data.bottomCtaTitle || defaultBottomCta.block.title,
        buttonLabel: data.bottomCtaButtonLabel || defaultBottomCta.block.button.label,
      },
    };
  } catch (error) {
    console.error("Failed to fetch Home page content from Sanity:", error);
    return fallback;
  }
}
