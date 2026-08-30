import Image from "next/image";
import { resolveSanityImageUrl } from "@/sanity/image";
import type { EventPartner } from "./types";

export function PartnerPill({ partner }: { partner: EventPartner }) {
  const logoSrc = resolveSanityImageUrl(partner.logo, 48, 48);

  return (
    <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-impact-gray/10">
        {logoSrc && <Image src={logoSrc} alt="" fill className="object-cover" />}
      </div>
      <span className="text-sm text-black">{partner.name}</span>
    </div>
  );
}
