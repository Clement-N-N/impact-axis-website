import Image from "next/image";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BlogAuthor } from "@/components/sections/blog-card/types";
import { resolveSanityImageUrl } from "@/sanity/image";

export function AuthorCard({
  author,
  role,
  locale,
}: {
  author: BlogAuthor;
  role: LocalizedText;
  locale: Locale;
}) {
  const imageSrc = resolveSanityImageUrl(author.image, 80, 80);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-impact-gray/10">
        {imageSrc && <Image src={imageSrc} alt="" fill className="object-cover" />}
      </div>
      <div>
        <p className="font-medium text-black">{author.name}</p>
        <p className="text-sm text-impact-gray">{getLocalizedText(role, locale)}</p>
      </div>
    </div>
  );
}
