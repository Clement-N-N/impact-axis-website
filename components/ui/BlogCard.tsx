import Image from "next/image";
import clsx from "clsx";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";
import { formatBlogDate, type BlogPost } from "@/components/sections/blog-card/types";

export type BlogCardVariant = "featured" | "compact" | "horizontal" | "list";

// Stacked layouts (featured/compact) share the same structure and only differ
// in title size; "list" gets its own layout entirely (date above title,
// read-more on its own row below the excerpt).
const TITLE_SIZE: Record<Exclude<BlogCardVariant, "list">, string> = {
  featured: "text-[clamp(1.5rem,2.375vw,2rem)]",
  compact: "text-[clamp(1.125rem,1.6vw,1.5rem)]",
  horizontal: "text-[clamp(1.125rem,1.5vw,1.375rem)]",
};

const LIST_TITLE_SIZE = "text-[clamp(1.125rem,1.5vw,1.375rem)]";

export function BlogCard({
  post,
  locale,
  readMoreLabel,
  variant = "featured",
}: {
  post: BlogPost;
  locale: Locale;
  readMoreLabel: LocalizedText;
  variant?: BlogCardVariant;
}) {
  const titleLink = (
    <Link
      href={post.href}
      className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0%_100%] bg-[length:0%_2px] transition-[background-size] duration-300 hover:bg-[length:100%_2px]"
    >
      {getLocalizedText(post.title, locale)}
    </Link>
  );

  const readMoreButton = (
    <Button href={post.href} variant="primary-flush" icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}>
      {getLocalizedText(readMoreLabel, locale)}
    </Button>
  );

  const imageSrc = resolveSanityImageUrl(post.image, 800, 800);

  const image = imageSrc ? (
    <Image
      src={imageSrc}
      alt=""
      fill
      className="object-cover grayscale transition-all duration-500 ease-out group-has-[h3:hover]/card:scale-110 group-has-[h3:hover]/card:grayscale-0"
    />
  ) : (
    <div className="h-full w-full bg-impact-gray/10" />
  );

  if (variant === "list") {
    return (
      <div className="group/card flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="relative w-full sm:w-1/3 aspect-[16/10] sm:aspect-auto max-h-[370px] shrink-0 self-stretch overflow-hidden">
          {image}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <span className="text-sm text-impact-gray">{formatBlogDate(post.date, locale)}</span>
          <h3 className={clsx("font-medium text-black", LIST_TITLE_SIZE)}>{titleLink}</h3>
          <p className="line-clamp-2 text-impact-gray">{getLocalizedText(post.excerpt, locale)}</p>
          <div className="pt-2">{readMoreButton}</div>
        </div>
      </div>
    );
  }

  const isHorizontal = variant === "horizontal";

  return (
    <div className={clsx("group/card", isHorizontal ? "flex flex-col sm:flex-row gap-4 sm:gap-6" : "flex flex-col")}>
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden",
          isHorizontal ? "aspect-[16/10] sm:aspect-square w-full sm:w-2/5" : "aspect-[2/1] w-full",
        )}
      >
        {image}
      </div>

      <div className={clsx("flex flex-1 flex-col", isHorizontal ? "justify-between gap-4 sm:gap-0" : "gap-6 pt-3")}>
        <div className="flex flex-col gap-2">
          <h3 className={clsx("font-medium text-black", TITLE_SIZE[variant])}>{titleLink}</h3>
          <p className="line-clamp-2 text-impact-gray">{getLocalizedText(post.excerpt, locale)}</p>
        </div>

        <div className="flex items-center justify-between pt-6">
          <span className="text-sm text-impact-gray">{formatBlogDate(post.date, locale)}</span>
          {readMoreButton}
        </div>
      </div>
    </div>
  );
}
