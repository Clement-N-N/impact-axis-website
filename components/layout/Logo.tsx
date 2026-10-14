import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo() {
  return (
    <Link href="/">
      {/* The wordmark is this link's only content, so its alt text is the
          link's accessible name. Left empty, the home link in the navbar and
          the mobile header announced as nothing but "link" on every page —
          axe reports this as a serious link-name failure. */}
      <Image
        src="/logos/impact_axis_black_transparent.png"
        alt="Impact Axis"
        width={1363}
        height={1313}
        className="h-9 w-auto md:h-8 xl:h-10"
        priority
      />
    </Link>
  );
}
