import { defineQuery } from "next-sanity";

export const HOME_SETTINGS_QUERY = defineQuery(
  `*[_type == "homeSettings"][0]{ heroVariant }`,
);

export const SOCIAL_LINKS_QUERY = defineQuery(
  `*[_type == "socialLinks"][0]{ facebook, instagram, x, linkedin, youtube }`,
);

export const HOME_FAQ_QUERY = defineQuery(`*[_type == "homeFaq"][0]{
  faqs[]{
    question{en, fr},
    answer{en, fr}
  }
}`);

export const HOME_IMPACT_QUERY = defineQuery(`*[_type == "homeImpact"][0]{
  metrics[]{
    number,
    label{en, fr}
  }
}`);

export const BLOG_POSTS_QUERY = defineQuery(`*[
  _type == "blogPost" &&
  (!defined($categorySlug) || category->slug.current == $categorySlug)
] | order(date desc){
  "id": slug.current,
  title{en, fr},
  excerpt{en, fr},
  date,
  image,
  "href": "/blog/" + slug.current
}`);

export const BLOG_CATEGORIES_QUERY = defineQuery(`*[_type == "blogCategory"] | order(title.en asc){
  title{en, fr},
  "slug": slug.current
}`);

export const BLOG_CATEGORY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "blogCategory" && slug.current == $slug][0]{ title{en, fr}, "slug": slug.current }`,
);

export const BLOG_CATEGORY_SLUGS_QUERY = defineQuery(
  `*[_type == "blogCategory"]{ "slug": slug.current }`,
);

export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`*[_type == "blogPost" && slug.current == $slug][0]{
  "id": slug.current,
  title{en, fr},
  excerpt{en, fr},
  date,
  image,
  "href": "/blog/" + slug.current,
  authorRole{en, fr},
  author->{name, image},
  category->{title{en, fr}},
  body{en, fr}
}`);

export const BLOG_SLUGS_QUERY = defineQuery(`*[_type == "blogPost"]{ "slug": slug.current }`);

export const EVENTS_QUERY = defineQuery(`*[_type == "event"] | order(date asc){
  "slug": slug.current,
  title{en, fr},
  location{en, fr},
  date,
  heroImage
}`);

export const EVENT_DETAILS_QUERY = defineQuery(`*[_type == "event"]{
  "slug": slug.current,
  heroImage,
  registerHref,
  speakers[]{
    title{en, fr},
    "name": person->name,
    "image": person->image
  },
  partners[]->{name, logo},
  programOverview{en, fr},
  specialGuests[]{
    title{en, fr},
    "name": person->name,
    "image": person->image
  }
}`);

export const HOME_TESTIMONIALS_QUERY = defineQuery(`*[_type == "homeTestimonials"][0]{
  testimonials[]->{
    name,
    title{en, fr},
    summary{en, fr},
    image,
    video{
      asset->{
        url,
        mimeType
      }
    }
  }
}`);

export const JOURNEY_PAGE_QUERY = defineQuery(`*[_type == "journeyPage"][0]{
  heroBadge{en, fr},
  heroHeadline{en, fr},
  heroSubtitle{en, fr},
  heroBackLink{en, fr},
  ctaTag{en, fr},
  ctaHeadline{en, fr},
  ctaParagraph{en, fr},
  ctaPartner{en, fr},
  ctaReports{en, fr}
}`);

export const JOURNEY_MILESTONES_QUERY = defineQuery(`*[_type == "journeyMilestone"] | order(year asc){
  year,
  shortYear,
  badge{en, fr},
  phase{en, fr},
  title{en, fr},
  description{en, fr},
  yearSubtitle{en, fr},
  tags,
  image
}`);

export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0]{
  heroHeadline{en, fr},
  heroParagraph{en, fr},
  heroCtaPartner{en, fr},
  heroCtaStory{en, fr},
  wweEyebrow{en, fr},
  wweHeadline{en, fr},
  wweParagraph1{en, fr},
  wweParagraph2{en, fr},
  wweCallout{en, fr},
  wweImageCaptionHeader{en, fr},
  wweImageCaptionBody{en, fr},
  missionTitle{en, fr},
  missionBody{en, fr},
  visionTitle{en, fr},
  visionBody{en, fr},
  approachEyebrow{en, fr},
  approachHeadline{en, fr},
  approachSubtitle{en, fr},
  approachSteps[]{
    stepNumber,
    title{en, fr},
    subtitle{en, fr},
    description{en, fr}
  },
  approachSummaryBanner{en, fr},
  storyEyebrow{en, fr},
  storyHeadline{en, fr},
  storyPhotoBadgeTag{en, fr},
  storyPhotoBadgeCaption{en, fr},
  storyParagraph1{en, fr},
  storyParagraph2{en, fr},
  storyParagraph3{en, fr},
  storyParagraph4{en, fr},
  storyTimelineBadge{en, fr},
  storyTimelineText{en, fr},
  principlesEyebrow{en, fr},
  principlesHeadline{en, fr},
  principles[]{
    title{en, fr},
    description{en, fr}
  },
  peopleEyebrow{en, fr},
  peopleHeadline{en, fr},
  peopleSubtitle{en, fr},
  coreTeamHeader{en, fr},
  coreTeamSubheader{en, fr},
  advisoryBoardHeader{en, fr},
  advisoryBoardSubheader{en, fr},
  partnershipEyebrow{en, fr},
  partnershipHeadline{en, fr},
  partnershipSubtitle{en, fr},
  leftBannerHeadline{en, fr},
  leftBannerParagraph{en, fr},
  leftBannerCtaLabel{en, fr},
  rightBannerHeadline{en, fr},
  rightBannerParagraph{en, fr},
  rightBannerCtaLabel{en, fr},
  rightBannerEmail
}`);

export const TEAM_MEMBERS_QUERY = defineQuery(`*[_type == "teamMember"] | order(order asc){
  name,
  role{en, fr},
  group,
  bio{en, fr},
  image,
  initials,
  order
}`);

export const PARTNER_LOGOS_QUERY = defineQuery(`*[_type == "partnerLogo"] | order(order asc){
  name,
  logo,
  order
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]{
  heroActiveVariant,
  heroHeadline{en, fr},
  heroDescription{en, fr},
  heroCtaLabel{en, fr},
  wweEyebrow{en, fr},
  wweHeadline{en, fr},
  wweParagraph1{en, fr},
  wweParagraph2{en, fr},
  solutionEyebrow{en, fr},
  solutionHeadline{en, fr},
  solutionParagraphs[]{
    en,
    fr
  },
  solutionButtonLabel{en, fr},
  wwbOverlayEyebrow{en, fr},
  wwbOverlayHeadline{en, fr},
  wwbSlides[]{
    legendLabel{en, fr},
    headline{en, fr},
    description{en, fr},
    image,
    buttonLabel{en, fr},
    buttonHref
  },
  wwsEyebrow{en, fr},
  wwsCards[]{
    number,
    label{en, fr},
    description{en, fr}
  },
  impactEyebrow{en, fr},
  impactParagraph{en, fr},
  impactReportCta{en, fr},
  bottomCtaTitle{en, fr},
  bottomCtaButtonLabel{en, fr}
}`);
