import Image from "next/image";
import clsx from "clsx";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogPost, HomeBlogContent } from "./types";

export function BlogCard({
  post,
  locale,
  readMoreLabel,
  variant = "default",
}: {
  post: BlogPost;
  locale: Locale;
  readMoreLabel: HomeBlogContent["readMoreLabel"];
  variant?: "default" | "horizontal";
}) {
  const isHorizontal = variant === "horizontal";

  return (
    <div className={clsx("group", isHorizontal ? "flex gap-6" : "flex flex-col")}>
      <div
        className={clsx(
          "relative shrink-0 overflow-hidden",
          isHorizontal ? "aspect-square w-2/5" : "aspect-[2/1] w-full",
        )}
      >
        <Image
          src={post.image}
          alt=""
          fill
          className="object-cover grayscale transition-all duration-500 ease-out group-has-[h3:hover]:scale-110 group-has-[h3:hover]:grayscale-0"
        />
      </div>

      <div className={clsx("flex flex-1 flex-col", isHorizontal ? "justify-between" : "gap-6 pt-6")}>
        <div className="flex flex-col gap-2">
          <h3
            className={clsx(
              "cursor-pointer font-medium text-black",
              isHorizontal ? "text-[clamp(1.125rem,1.5vw,1.375rem)]" : "text-[clamp(1.5rem,2.375vw,2rem)]",
            )}
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0%_100%] bg-[length:0%_2px] transition-[background-size] duration-300 hover:bg-[length:100%_2px]">
              {getLocalizedText(post.title, locale)}
            </span>
          </h3>
          <p className="line-clamp-2 text-impact-gray">{getLocalizedText(post.excerpt, locale)}</p>
        </div>

        <div className="flex items-center justify-between pt-6">
          <span className="text-sm text-impact-gray">{post.date}</span>
          <Button href={post.href} variant="primary" icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}>
            {getLocalizedText(readMoreLabel, locale)}
          </Button>
        </div>
      </div>
    </div>
  );
}
