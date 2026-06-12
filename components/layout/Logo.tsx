import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="/logos/impact_axis_black_transparent.png"
        alt=""
        width={1363}
        height={1313}
        className="h-9 w-auto md:h-10"
        priority
      />
    </Link>
  );
}
